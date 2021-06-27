<template>
	<div class="minicart__section minicart__section--empty js-minicart-items">
		<div class="minicart__empty-wrapper">
			<p class="minicart__section-empty-message">
				{{ 'cart.general.empty' | t }}
			</p>

			<a
				v-if="continueShoppingButtonText && continueShoppingButtonUrl"
				:href="continueShoppingButtonUrl"
				class="minicart__empty-button button button--primary button--full-width"
			>{{ continueShoppingButtonText }}</a>
		</div>
	</div>
</template>

<script>
	export default {
	    name: 'EmptyMinicart',
		props: {
			continueShoppingButtonText: {
				type: String,
				required: false
			},
			continueShoppingButtonUrl: {
				type: String,
				required: false
			}
		}
	}
</script>
