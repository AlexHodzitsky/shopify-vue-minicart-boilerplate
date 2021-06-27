import axios from "axios";
import unescape from "./helpers/unescape";

export default {
	loaded: false,
	translations: {},
	async load() {
		const translations = await axios
			.get("/?view=translations", {
				responseType: "json",
			})
			.then((response) => response.data);

		this.loaded = true;
		this.translations = translations;

		document.dispatchEvent(
			new CustomEvent("theme:translations:loaded", {
				detail: {
					translations,
				},
			})
		);
	},
	get(name, params = {}) {
		try {
			const translation = name.split(".").reduce((translations, key) => {
				if (translations.hasOwnProperty(key)) {
					return translations[key];
				}

				throw new Error("Translation missed");
			}, this.translations);

			return Object.keys(params).reduce((result = "", key) => {
				let regex = new RegExp(`{{(\\s+)?(${key})(\\s+)?}}`, "gm");

				return result.replace(regex, params[key]);
			}, unescape(translation));
		} catch (e) {}

		return `"${name}" translation missed`;
	},
	all() {
		return this.translations;
	}
};
