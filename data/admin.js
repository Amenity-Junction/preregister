const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];
const dateFormat = dt => {
	const date = new Date(dt);
	return `${months[date.getMonth() - 1]} ${date.getDay()}, ${date.getFullYear()}`;
};

$(() => {
	$('.view-members').hide();

	$('#viewBtn').on('click', (e) => {
		const password = prompt('Enter the master password:');
		debug(`Password: ${password}`);
		if (password == null || password == '') {
			$('.view-members').show();
			$('.view-members').html('<div class="text-center text-info">Enter a password.</div>');
		} else {
			$('.view-members').show();
			$('.view-members').html('<div class="text-center"><div class="spin success"></div></div>');
			(async () => {
				const response = await fetch(SERVER_URI, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Access-Password': password
					}
				});
				debug(response);
				if (response.ok) {
					const body = await response.json();
					$('.view-members').html('');
					const members = body;
					let lastHr = null;
					for (const member of members) {
						const div = $('<div></div>').addClass([
							'text-center',
							'col-12 col-md-10 mb-3 offset-md-1 mb-2'
						]);
						if (member.photo != null && member.photo !== '')
							div.append($('<img />').attr({
								src: `${SERVER_URI}/images/${member.photo}`
							}).css({
								height: '170px',
								width:  '170px'
							}));
						const data = $('<div></div>').addClass([
							'text-center',
							'mb-3'
						]);
						data.append($(`<div></div>`).append($(`<span class='h6 d-inline'>Name:&nbsp;</span>`)).append($(`<span>${member.name}</span>`)));
						data.append($(`<div></div>`).append($(`<span class='h6 d-inline'>Address:&nbsp;</span>`)).append($(`<small>${member.address}</small>`)));
						data.append($(`<div></div>`).append($(`<span class='h6 d-inline'>Phone number:&nbsp;</span>`)).append($(`<span>${member.phone}</span>`)));
						data.append($(`<div></div>`).append($(`<span class='h6 d-inline'>Aadhaar Card:&nbsp;</span>`)).append($(`<small>${member.aadhaar}</span>`)));
						data.append($(`<div></div>`).append($(`<span class='h6 d-inline'>Date of Birth:&nbsp;</span>`)).append($(`<span>${dateFormat(member.dob)}</small>`)));
						data.append($(`<div></div>`).append($(`<span class='h6 d-inline'>Years of Experience:&nbsp;</span>`)).append($(`<span>${member.exp}</span>`)));
						$('.view-members').append(div);
						$('.view-members').append(data);
						lastHr = $('<hr/>').css('border-color', '#999');
						$('.view-members').append(lastHr);
					}
					lastHr.remove();
				} else
					$('.view-members').html(`<div class="text-center text-danger">Failed (${await response.text()}).</div>`);
				
			})();
		}
	});

	$('#delBtn').on('click', (e) => {
		const password = prompt('Enter the master deletion password:');
		debug(`Password: ${password}`);
		if (password == null || password == '') {
			$('.view-members').show();
			$('.view-members').html('<div class="text-center text-info">Enter a password.</div>');
		} else {
			$('.view-members').show();
			$('.view-members').html('<div class="text-center"><div class="spin success"></div></div>');
			(async () => {
				const response = await fetch(SERVER_URI, {
					method: 'DELETE',
					body: JSON.stringify(password),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				debug(response);
				if (response.ok)
					$('.view-members').html('<div class="text-center text-success">All records deleted.</div>');
				else
					$('.view-members').html(`<div class="text-center text-danger">Failed (${await response.text()}).</div>`);
				
			})();
		}
	});
});