<template>
	<div
		class="minicart"
		:class="{ 'minicart--shown': isOpened }"
		id="minicart"
	>
		<div class="minicart__overlay" @click="closeCart"></div>

		<div class="minicart__container">
			<div class="minicart__wrapper">
				<div class="minicart__section minicart__section--header">
					<div class="minicart__title-wrapper">
						<div class="minicart__close" @click="closeCart">
							{{ "cart.label.close" | t }}
						</div>

						<h4 class="minicart__title" v-html="t('cart.general.title_html')"></h4>
					</div>
				</div>

				<div class="minicart__body" :class="{ 'minicart__body--empty': cart.item_count === 0 }">
					<EmptyMinicart
						:continue-shopping-button-text="customizer.continue_shopping_button_text"
						:continue-shopping-button-url="customizer.continue_shopping_button_url"
						v-if="cart.item_count === 0"
					/>

					<SimpleBar
						class="minicart__section minicart__section--items custom-simple-bar js-minicart-items"
						data-simplebar-auto-hide="false"
						v-else
					>
						<div class="minicart-product" v-for="item in cart.items" :key="item.key">
							<div class="minicart-product__wrapper">
								<a :href="item.url" class="minicart-product__image-wrapper">
									<img
										class="minicart-product__image"
										:src="item.image | img_url('138x')"
										:alt="item.title"
									/>
								</a>

								<div class="minicart-product__content">
									<button type="button" class="minicart-product__remove-button" @click="removeItem(item.key)">
										<IconRemove />
									</button>

									<a :href="item.url" class="minicart-product__title">
										{{ item.product_title }}
									</a>

									<div class="minicart-product__price-wrapper">
										<p
											v-if="item.compare_at_price > item.price"
											v-html="money(item.compare_at_price * item.quantity)"
											class="minicart-product__compare-at-price"
										></p>

										<p class="minicart-product__price" v-html="money(item.price * item.quantity)"></p>
									</div>

									<div class="minicart-product__options" v-if="item.options_with_values.length">
										<div class="minicart-product__option" v-for="option in item.options_with_values" :key="option.name">
											<p class="minicart-product__option-name">
												{{ option.name }}:
											</p>

											<p class="minicart-product__option-value">
												{{ option.value }}
											</p>
										</div>
									</div>

									<table class="minicart-product__quantity">
										<tr>
											<td class="minicart-product__quantity-column minicart-product__quantity-column--label">
												<p class="minicart-product__quantity-label">
													{{ "cart.label.quantity" | t }}
												</p>
											</td>

											<td class="minicart-product__quantity-column minicart-product__quantity-column--button">
												<button
													class="minicart-product__quantity-button"
													@click="changeQuantity({
														key: item.key,
														quantity: item.quantity - 1
													})"
												>-</button>
											</td>

											<td class="minicart-product__quantity-column minicart-product__quantity-column--input">
												<div class="minicart-product__quantity-input-wrapper">
													<input
														class="minicart-product__quantity-input"
														type="number"
														v-model.number.lazy="item.quantity"
														@change="changeQuantity({
															key: item.key,
															quantity: item.quantity
														})"
													/>
												</div>
											</td>

											<td class="minicart-product__quantity-column minicart-product__quantity-column--button">
												<button
													class="minicart-product__quantity-button"
													@click="changeQuantity({
														key: item.key,
														quantity: item.quantity + 1
													})"
												>+</button>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
					</SimpleBar>
				</div>

				<div class="minicart__section minicart__section--footer" v-if="cart.item_count">
					<div class="minicart__footer-wrapper" v-if="customizer.enable_order_notes">
						<textarea
							class="textarea textarea--full-width minicart__order-note-textarea"
							:placeholder="customizer.order_notes_placeholder"
							v-model.lazy="cart.note"
							@change="updateOrderNote(cart.note)"
						></textarea>
					</div>

					<div class="minicart__footer-wrapper">
						<div class="minicart__subtotal-wrapper">
							<div class="minicart__subtotal-label">
								{{ "cart.label.subtotal" | t }}
							</div>

							<div class="minicart__subtotal-value" v-html="money(cart.total_price)"></div>
						</div>

						<a href="/checkout" class="minicart__checkout-button button button--primary button--full-width">
							{{ "cart.general.checkout" | t }}
						</a>

						<div
							class="minicart__footer-continue-button-wrapper"
							v-if="customizer.continue_shopping_button_url && customizer.continue_shopping_button_text"
						>
							<a :href="customizer.continue_shopping_button_url" class="link minicart__footer-continue-button">
								{{ customizer.continue_shopping_button_text }}
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import EmptyMinicart from "./components/EmptyMinicart";
import IconRemove from "./icons/IconRemove";

import SimpleBar from "simplebar-vue";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";

import {
	mapActions,
	mapGetters
} from "vuex";

import {
	GETTER_CART,
	ACTION_INIT_CART,
	ACTION_REMOVE_ITEM,
	ACTION_CHANGE_QUANTITY,
	ACTION_UPDATE_ORDER_NOTE
} from "./store/store";

import { mapFilters } from "./filters/mapFilters";
import { MONEY, TRANSLATE } from "./filters/filters";

export default {
	name: "Minicart",
	data: () => ({
		isOpened: false,
		customizer: {}
	}),
	mounted() {
		document.addEventListener("open:minicart", this.openCart);

		this.initCustomizer();
	},
	computed: {
		...mapGetters([
			GETTER_CART,
		]),
	},
	methods: {
		...mapActions([
			ACTION_INIT_CART,
			ACTION_REMOVE_ITEM,
			ACTION_CHANGE_QUANTITY,
			ACTION_UPDATE_ORDER_NOTE
		]),
		...mapFilters([
			MONEY,
			TRANSLATE
		]),
		initCustomizer() {
			const customizerDataHolder = document.getElementById("minicart-customizer-data");

			if(!customizerDataHolder) {
				return null;
			}

			try {
				const data = JSON.parse(customizerDataHolder.innerHTML);

				this.customizer = Object.assign({}, {}, data.customizer);
			} catch (e) {}
		},
		closeCart(e) {
			if (e) {
				e.preventDefault();
			}

			const itemsWrapper = this.$el.querySelector(".js-minicart-items");

			enableBodyScroll(itemsWrapper);

			this.isOpened = false;
		},
		openCart() {
			const itemsWrapper = this.$el.querySelector(".js-minicart-items");

			disableBodyScroll(itemsWrapper);

			this.isOpened = true;
		},
	},
	components: {
		EmptyMinicart,
		IconRemove,
		SimpleBar
	}
}
</script>
