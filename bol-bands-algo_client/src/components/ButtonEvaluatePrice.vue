<template>
    <v-btn @click="handleEvaluatePrice">Evaluate Current Price</v-btn>
</template>

<script>
    import EvaluateCurrentPriceQuery from '../graphql/priceEvaluation/EvaluateCurrentPriceQuery.gql';
	export default {
		methods: {
			handleEvaluatePrice() {
				this.$apollo.query({
                    query: EvaluateCurrentPriceQuery
                });
            }
        }
	}
</script>
