slate.Variants = (function () {
	function Variants(options) {
		this.container 				= options.container;
		this.product 				= options.product;
		this.singleOptionSelector 	= options.singleOptionSelector;
		this.originalSelectorId 	= options.originalSelectorId;
		this.enableHistoryState 	= options.enableHistoryState;
		this.currentVariant 		= this._getVariantFromOptions();

		this.container.querySelectorAll(this.singleOptionSelector).forEach((element) => {
			element.addEventListener('change', this._onSelectChange.bind(this));
		});
	}

	Variants.prototype._getCurrentOptions = function () {
		return Array.from(this.container.querySelectorAll(this.singleOptionSelector)).reduce((result, element) => {
			const type = element.getAttribute('type');

			if ((type === 'radio' || type === 'checkbox') && !element.checked) {
				return result;
			}

			result.push({
				value: element.value,
				index: element.dataset.index
			});

			return result;
		}, []);
	};

	Variants.prototype._getVariantFromOptions = function () {
		const selectedValues = this._getCurrentOptions();
		const variants = this.product.variants;

		const found = variants.find((variant) => {
			return selectedValues.every((option) => {
				return option.value === variant[option.index];
			});
		});

		return found || null;
	};

	Variants.prototype._onSelectChange = function () {
		const variant = this._getVariantFromOptions();

		this.container.dispatchEvent(new CustomEvent('variantChange', {
			detail: {
				variant
			}
		}));

		if (!variant) {
			return null;
		}

		this._updateMasterSelect(variant);
		this._updateImages(variant);
		this._updatePrice(variant);
		this.currentVariant = variant;

		if (this.enableHistoryState) {
			this._updateHistoryState(variant);
		}
	};

	Variants.prototype._updateImages = function (variant) {
		const variantImage = variant.featured_image || {};
		const currentVariantImage = this.currentVariant.featured_image || {};

		if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
			return null;
		}

		this.container.dispatchEvent(new CustomEvent('variantImageChange', {
			detail: {
				variant: variant
			}
		}));
	};

	Variants.prototype._updatePrice = function (variant) {
		if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
			return null;
		}

		this.container.dispatchEvent(new CustomEvent('variantPriceChange', {
			detail: {
				variant: variant
			}
		}));
	};

	Variants.prototype._updateHistoryState = function (variant) {
		if (!history.replaceState || !variant) {
			return null;
		}

		let newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?variant=${variant.id}`;
		window.history.replaceState({
			path: newUrl
		}, '', newUrl);
	};

	Variants.prototype._updateMasterSelect = function (variant) {
		this.container.querySelector(this.originalSelectorId).value = variant.id;
	};

	return Variants;
})();
