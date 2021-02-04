const debug = (...args) => { console.log(...args); };
const SERVER_URI = `http://localhost:5000`;

$(() => {
	window.notifier = new AWN({
		durations: {
			alert: 2000
		},
		position: 'top-right'
	});

	$('#form').on('submit', e => {
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
		let toContinue = true;
		window.memberData = {};
		for (const key of values) {
			const value = $(`#${key}`).val();
			window.memberData[key] = value;
		}
		window.memberData['photo'] = $('#photo').get(0).files[0];
		Object.keys(window.memberData).forEach(k => {
			if ((window.memberData[k] == null || window.memberData[k] == '') && k !== 'photo') {
				if (toContinue)
					notifier.alert(`Fill in the ${(() => {
						switch (k) {
							case 'aadhaar':
								return 'Aadhaar Card Number';
							case 'phone':
								return 'phone number';
							case 'exp':
								return 'years of experience';
							case 'dob':
								return 'date of birth';
							default:
								return k;
						}
					})()}!`);
				toContinue = false;
			}
		});
		debug(window.memberData);
		if (!$('#agreed').is(':checked')) {
			notifier.alert('You must agree to the terms & conditions.');
		} else if (toContinue) {
			const formData = new FormData;
			for (const k in window.memberData)
				formData.append(k, window.memberData[k]);
			(async () => {
				const response = await fetch(SERVER_URI, {
					method: 'POST',
					body: formData
				});
				console.log(response);
			})();
		}
	});
});