import { formatMoney } from "@shopify/theme-currency";
import settings from "../../core/settings";
import { getSizedImageUrl } from "@shopify/theme-images";
import translations from "../../core/translations";
import unescapeValue from "../../core/helpers/unescape";

export function getMoney(value) {
	return formatMoney(value, null);
}

export function getMoneyWithColoredCents(value) {
	const money = getMoney(value);

	const parts = money.split('.');

	if(parts.length !== 2) {
		return money;
	}

	return unescapeValue(`${parts[0]}.<span class="cents">${parts[1]}</span>`);
}

export function getMoneyWithNoDecimals(value) {
	return formatMoney(value, "${{amount_no_decimals}}");
}

export function getImageUrl(src, size) {
	const settingsAll = settings.all();

	if (!src) {
		if (settingsAll.placeholder) {
			src = settingsAll.placeholder;
		} else {
			return null;
		}
	}

	return getSizedImageUrl(src, size);
}

export function translate(value, params = {}) {
	return translations.get(value, params);
}

export function unescape(value) {
	return unescapeValue(value);
}
