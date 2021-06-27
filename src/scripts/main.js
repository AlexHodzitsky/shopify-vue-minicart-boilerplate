require('./vendor/vendor');

import objects from "./core/objects";
import translations from "./core/translations";
import settings from "./core/settings";
import * as sections from "@shopify/theme-sections";

const DOMContentLoadedPromise = new Promise((resolve, reject) => {
	document.addEventListener('DOMContentLoaded', async () => {
		console.log("DOMContentLoaded");
		resolve();
	});
});

document.addEventListener("theme:translations:loaded", (event) => {
	console.log(event.detail.translations);
	// Do Something when translations loaded
});

document.addEventListener("theme:translations:reload", async () => {
	await translations.load();
});

document.addEventListener("theme:settings:loaded", (event) => {
	// Do Something when translations loaded
});

document.addEventListener("theme:settings:reload", async () => {

});

document.addEventListener("theme:objects:loaded", (event) => {
	// Do Something when translations loaded

	console.log(event);
});

document.addEventListener("theme:objects:reload", async () => {

});

(async () => {
	await translations.load();
	await objects.load();
})();

import * as bodyScrollLock from "body-scroll-lock";
global.bodyScrollLock = bodyScrollLock;

import $ from "jquery";
global.jQuery = $;
global.$ = $;

window.slate = window.slate || {};
window.theme = window.theme || {};

require('./libs/lazysizes');

require('./libs/a11y');
require('./libs/utils');
require('./libs/rte');
require('./libs/variants');

require('./components/lazy-load-images');

/*================ Sections ================*/
require('./sections/minicart');

/*================ Templates ================*/
require('./templates/customers-addresses');
require('./templates/customers-login');

(async () => {
	try {
		await Promise.all([
			translations.load(),
			objects.load(),
			settings.load(),
			DOMContentLoadedPromise,
		]);

		document.dispatchEvent(new CustomEvent("theme:all:loaded"));
	} catch (error) {
		console.log(error);
	}

	sections.load([
		"minicart",
	]);
})()
