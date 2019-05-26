<template>
    <v-layout justify-space-around mx-5>
        <div class="key-metric">
            <div class="caption">Moving Average Slope</div>
            <div class="headline">{{meta.moving_average_slope | formatNumber }}</div>
        </div>
        <div class="key-metric">
            <div class="caption">Price</div>
            <div class="headline">{{meta.price | formatCurrency}}</div>
        </div>
        <div :class="['key-metric', isLowerHighlighted && 'highlighted']">
            <div class="caption">Bol. Lower</div>
            <div class="headline">{{meta.bol_lower | formatCurrency}}</div>
        </div>
        <div class="key-metric">
            <div class="caption">Moving Average</div>
            <div class="headline">{{meta.moving_average | formatCurrency}}</div>
        </div>
        <div :class="['key-metric', isUpperHighlighted && 'highlighted']">
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
		computed: {
			isLowerHighlighted() {
				return this.meta.moving_average_slope > 0;
			},
			isUpperHighlighted() {
				return this.meta.moving_average_slope < 0;
			}
		}
	}
</script>

<style lang="scss" scoped>
    .key-metric {
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        display: flex;
        width: 120px;
        flex-direction: column;
        align-items: center;

        :first-child {
            color: grey;
        }

        &.highlighted {
            /*border: 1px solid #CFD8DC;*/

            :last-child {
                color: #2196F3;
            }
        }
    }

</style>