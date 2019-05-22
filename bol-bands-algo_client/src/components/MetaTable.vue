<template>
    <v-layout justify-space-around mx-5>
        <div class="key-metric">
            <div class="caption">Price</div>
            <div class="headline">{{meta.price | formatCurrency}}</div>
        </div>
        <div class="key-metric">
            <div class="caption">Moving Average</div>
            <div class="headline">{{meta.moving_average | formatCurrency}}</div>
        </div>
        <div class="key-metric">
            <div class="caption">Bol. Lower</div>
            <div class="headline">{{meta.bol_lower | formatCurrency}}</div>
        </div>
        <div class="key-metric">
            <div class="caption">Bol. Upper</div>
            <div class="headline">{{meta.bol_upper | formatCurrency}}</div>
        </div>
    </v-layout>
</template>

<script>
	import MetaQuery from "../graphql/meta/Meta.gql";

	export default {
		name: "MetaTable.vue",
		apollo: {
			meta: {
				query: MetaQuery
			}
		},
	}
</script>

<style lang="scss" scoped>
    .key-metric {
        display: flex;
        flex-direction: column;
        align-items: center;

        :first-child {
            color: grey;
        }

    }

</style>