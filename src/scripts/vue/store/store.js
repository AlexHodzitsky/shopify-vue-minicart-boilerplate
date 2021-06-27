import Vue from "vue";
import Vuex from "vuex";
import { addItems, changeQuantity, getCart, removeItem, updateCart } from "../services/api";

Vue.use(Vuex);

export const STATE_LOADING = "loading";
export const STATE_CART = "cart";

export const GETTER_CART = "cart";

export const MUTATION_UPDATE_LOADING = "updateLoading";
export const MUTATION_UPDATE_CART = "updateCart";

export const ACTION_INIT_CART = "initCart";
export const ACTION_GET_CART = "getCart";
export const ACTION_GET_ADDITIONAL_DATA = "getAdditionalData";
export const ACTION_ADD_TO_CART = "addToCart";
export const ACTION_REMOVE_ITEM = "removeItem";
export const ACTION_CHANGE_QUANTITY = "changeQuantity";
export const ACTION_UPDATE_ORDER_NOTE = "updateOrderNote";

export const store = new Vuex.Store({
	state: {
		[STATE_LOADING]: true,
		[STATE_CART]: {
			items: []
		}
	},
	getters: {
		[GETTER_CART](state) {
			return state[STATE_CART];
		}
	},
	mutations: {
		[MUTATION_UPDATE_CART](state, cart) {
			cart.item_count = Object.values(cart.items).reduce(
				(total, item) => {
					return total + item.quantity;
				},
				0
			);

			document.dispatchEvent(
				new CustomEvent("cart:item_count", {
					detail: {
						item_count: cart.item_count
					}
				})
			);

			state[STATE_CART] = cart;
		},
		[MUTATION_UPDATE_LOADING](state, loading) {
			state[STATE_LOADING] = loading;
		}
	},
	actions: {
		async [ACTION_INIT_CART](context) {
			context.commit(MUTATION_UPDATE_LOADING, true);

			await context.dispatch(ACTION_GET_CART);

			context.commit(MUTATION_UPDATE_LOADING, false);
		},
		async [ACTION_GET_CART](context, errorCallback = () => {}) {
			context.commit(MUTATION_UPDATE_LOADING, true);

			try {
				const cart = await getCart();

				const cartWithAdditionalData = await context.dispatch(
					ACTION_GET_ADDITIONAL_DATA,
					cart
				);

				context.commit(MUTATION_UPDATE_CART, cartWithAdditionalData);
				context.commit(MUTATION_UPDATE_LOADING, false);
			} catch (error) {
				await errorCallback(error);
			}
		},
		async [ACTION_GET_ADDITIONAL_DATA](context, cart) {
			const products = await fetch(
				`/cart?view=additional-data`
			).then((res) => res.json());

			cart.items = cart.items.map((item) => {
				if (!products.hasOwnProperty(item.id)) {
					return item;
				}

				return {
					...item,
					...products[item.id]
				};
			});

			return cart;
		},
		async [ACTION_ADD_TO_CART](
			context,
			products,
			errorCallback = () => {}
		) {
			context.commit(MUTATION_UPDATE_LOADING, true);

			try {
				await addItems(products);

				await context.dispatch(ACTION_GET_CART);

				context.commit(MUTATION_UPDATE_LOADING, false);
			} catch (error) {
				await errorCallback(error);
			}
		},
		async [ACTION_REMOVE_ITEM](context, key, errorCallback = () => {}) {
			context.commit(MUTATION_UPDATE_LOADING, true);

			try {
				let cart = await removeItem(key);

				const cartWithAdditionalData = await context.dispatch(
					ACTION_GET_ADDITIONAL_DATA,
					cart
				);

				context.commit(MUTATION_UPDATE_CART, cartWithAdditionalData);
				context.commit(MUTATION_UPDATE_LOADING, false);
			} catch (error) {
				await errorCallback(error);
			}
		},
		async [ACTION_CHANGE_QUANTITY](
			context,
			{ key, quantity },
			errorCallback = () => {}
		) {
			context.commit(MUTATION_UPDATE_LOADING, false);

			try {
				let cart = await changeQuantity(key, quantity);

				const cartWithAdditionalData = await context.dispatch(
					ACTION_GET_ADDITIONAL_DATA,
					cart
				);

				context.commit(MUTATION_UPDATE_CART, cartWithAdditionalData);
				context.commit(MUTATION_UPDATE_LOADING, false);
			} catch (error) {
				await errorCallback(error);
			}
		},
		async [ACTION_UPDATE_ORDER_NOTE](
			context,
			note,
			errorCallback = () => {}
		) {
			context.commit(MUTATION_UPDATE_LOADING, false);

			try {
				const cart = await updateCart({ note });

				const cartWithAdditionalData = await context.dispatch(
					ACTION_GET_ADDITIONAL_DATA,
					cart
				);

				context.commit(MUTATION_UPDATE_CART, cartWithAdditionalData);
				context.commit(MUTATION_UPDATE_LOADING, false);
			} catch (error) {
				await errorCallback(error);
			}
		}
	}
});
