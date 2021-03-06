const path = require('path');
const fs = require('fs-extra');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const AVOID = [
	'.gitignore',
	'.git',
	'package.json',
	'package-lock.json',
	'deploy.js',
	'.vscode',
	'docs',
	'README.md'
];

const RETAIN = [
	'.git'
];

if (require && require.main === module) {
	const gitRepo = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')))?.repository?.url?.substr(4);
	const args = yargs(hideBin(process.argv)).alias({
		'd': 'dest',
		'v': 'verbose',
		'c': 'clean'
	}).argv;
	let debug = args.v ? (...params) => console.log(...params) : () => {};
	const destDir = args.d ?? path.join(__dirname, 'dist');
	debug(`Deploying to ${gitRepo} via ${destDir}...`);
	if (args.c && fs.existsSync(destDir)) {
		debug('Cleaning directory...');
		const contents = fs.readdirSync(destDir);
		for (const elem of contents) {
			if (RETAIN.indexOf(elem) >= 0)
				continue;
			const file = path.join(destDir, elem);
			if (fs.lstatSync(file).isDirectory()) {
				fs.emptyDirSync(file);
				fs.rmdirSync(file);
			} else {
				fs.rmSync(file);
			}
		}
	}
	const contents = fs.readdirSync(__dirname).filter(name => name !== path.basename(destDir));
	if (!fs.existsSync(destDir))
		fs.mkdirsSync(destDir);
	debug(`Ignoring ${AVOID.map(a => `"${a}"`).join(', ')}.`)
	contents.filter(file => AVOID.indexOf(file) < 0).forEach(file => {
		debug(`Copying ${file}...`);
		fs.copySync(path.join(__dirname, file), path.join(destDir, file), {
			overwrite: true,
			recursive: true
		});
	});
	(async () => {
		process.chdir(destDir);
		const commands = [
			'git init',
			() => {
				debug('Making .nojekyll...');
				fs.writeFileSync('.nojekyll', '');
			},
			'git add .',
			'git commit -m \"Deploy\"',
			'git branch -M gh-pages',
			async () => {
				const remotes = ((await exec(`git remote`)).stdout ?? '').split(/\s/g);
				if (remotes.indexOf('origin') < 0) {
					const output = exec(`git remote add origin \"${gitRepo}\"`);
				}
			},
			`git push -uf origin HEAD:gh-pages`
		];
		for (const cmd of commands) {
			if (typeof cmd === 'string') {
				const output = await exec(cmd);
				debug(output?.stdout);
			} else if (typeof cmd === 'function')
				await cmd();
		}
		console.log('Deployed!');
	})();
}
