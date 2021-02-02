const debug = (...args) => { console.log(...args) };

$(() => {
	$('#form').submit(e => {
		e.preventDefault();
		let values = [
			'name',
			'address',
			'phone',
			'aadhaar',
			'occupation',
			'dob',
			'exp'
		];
		window.data = {};
		for (const key of values) {
			const value = $(`#${key}`).val();
			window.data[key] = value;
			debug(key, value);
		}
		window.data['photo'] = $('#photo').get(0).files[0];
		debug(key, value);
	});
});