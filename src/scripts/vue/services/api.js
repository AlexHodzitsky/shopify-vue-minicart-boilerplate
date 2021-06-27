import axios from "axios";
import qs from "qs";

const HEADERS = {
	Accept: "*/*",
	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	"X-Requested-With": "XMLHttpRequest"
};

export function getCart() {
	return axios.get("/cart.js").then((res) => res.data);
}

export function updateCart(updates = {}) {
	return axios.post("/cart/update.js", qs.stringify(updates), {
		headers: HEADERS
	});
}

export function addItems(items = []) {
	return axios.post(
		"/cart/add.js",
		qs.stringify({
			items
		}),
		{
			headers: HEADERS
		}
	);
}

export function addItem(item) {
	return addItems([item]).then((response) => response.data);
}

export function changeItem(newItem) {
	return axios
		.post("/cart/change.js", qs.stringify(newItem), {
			headers: HEADERS
		})
		.then((res) => res.data);
}

export function changeQuantity(key, quantity) {
	return changeItem({
		id: key,
		quantity
	});
}

export function removeItem(key) {
	return changeQuantity(key, 0);
}
