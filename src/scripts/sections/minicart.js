import { register } from "@shopify/theme-sections";
import Vue from "vue";
import { initVueGlobalFilters } from "../vue/filters/filters";
import { store, ACTION_INIT_CART, ACTION_ADD_TO_CART } from "../vue/store/store";
import MinicartVue from "../vue/Minicart";
import { addToCartSubmit } from "../core/helpers/addToCartSubmit";

initVueGlobalFilters();

document.addEventListener("product:add", async function (event) {
	const detail = event.detail;

	if (!detail) {
		return null;
	}

	const items = detail.items;

	if (!items) {
		return null;
	}

	const errorCallback =
		typeof event.detail.errorCallback === "function"
			? event.detail.errorCallback
			: () => {};

	await store.dispatch(ACTION_ADD_TO_CART, event.detail.items, errorCallback);

	const callback = detail.callback;

	if (typeof callback === "function") {
		await callback();
	}

	document.dispatchEvent(new CustomEvent("open:minicart"));
});

register("minicart", {
	minicartOpeners: null,
	onLoad: function () {
		this.init();
		this.initEvents();
		this.initQuickShop();
	},
	init: function () {
		store.dispatch(ACTION_INIT_CART);

		new Vue({
			store,
			render: (h) => h(MinicartVue)
		}).$mount(this.container);

		this.minicartOpeners = document.querySelectorAll(".js-open-minicart");
	},
	initQuickShop: function () {
		const forms = document.querySelectorAll("[data-add-to-cart-form]");

		forms.forEach((form) => {
			form.addEventListener("keydown", (event) => {
				if (event.keyCode === 13) {
					event.preventDefault();
				}
			});

			form.addEventListener("submit", addToCartSubmit, true);
		});
	},
	initEvents: function () {
		this.minicartOpeners.forEach((opener) => {
			opener.addEventListener("click", this.open.bind(this));
		});
	},
	open: function (e) {
		e.preventDefault();

		document.dispatchEvent(new CustomEvent("open:minicart"));
	}
});
