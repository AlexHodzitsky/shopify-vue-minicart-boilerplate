import Vue from "vue";
import translations from "../../core/translations";
import settings from "../../core/settings";
import unescape from "../../core/helpers/unescape";
import { getSizedImageUrl } from "@shopify/theme-images";
import { formatMoney } from "@shopify/theme-currency";
import { getMoneyWithColoredCents } from "../../core/helpers/filters";

export const MONEY 				= "money";
export const MONEY_NO_DECIMALS 	= "moneyNoDecimals";
export const IMAGE_URL 			= "img_url";
export const TRANSLATE 			= "t";
export const UNESCAPE 			= "unescape";

export function initVueGlobalFilters() {
	Vue.filter(MONEY, function (value) {
		return getMoneyWithColoredCents(value);
	});

	Vue.filter(MONEY_NO_DECIMALS, function (value) {
		return formatMoney(value, "${{amount_no_decimals}}");
	});

	Vue.filter(IMAGE_URL, function (src, size) {
		const settingsAll = settings.all();

		if (!src) {
			if (settingsAll.placeholder) {
				src = settingsAll.placeholder;
			} else {
				return null;
			}
		}

		return getSizedImageUrl(src, size);
	});

	Vue.filter(TRANSLATE, function (value, params = {}) {
		return translations.get(value, params);
	});

	Vue.filter(UNESCAPE, function (value) {
		return unescape(value);
	});
}
