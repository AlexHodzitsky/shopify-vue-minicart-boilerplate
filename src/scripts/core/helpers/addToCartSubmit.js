import serialize from "form-serialize";

export function addToCartSubmit(event) {
	event.preventDefault();

	const form = event.target;

	const formData = serialize(form, {
		hash: true
	});

	form.classList.add('adding');

	document.dispatchEvent(new CustomEvent('product:add', {
		detail: {
			items: [formData],
			callback: () => {
				setTimeout(() => {
					form.classList.remove('adding');
				}, 500);
			},
			errorCallback: () => {
				form.classList.remove('adding');
			}
		}
	}));
}
