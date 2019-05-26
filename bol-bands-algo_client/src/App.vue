<template>
    <v-app>
        <v-container align-center justify-center d-flex>
            <v-slide-y-transition>
                <v-layout v-if="!isLoading" row align-center >
                    <v-flex grow pr-2 mb-5>
                        <meta-table></meta-table>
                        <price-chart></price-chart>
                    </v-flex>
                    <v-flex shrink pl-2>
                        <v-layout justify-center>
                            <button-evaluate-price></button-evaluate-price>
                        </v-layout>
                        <price-evaluations-table></price-evaluations-table>
                    </v-flex>
                </v-layout>
            </v-slide-y-transition>
        </v-container>
    </v-app>
</template>

<script>
	import PositionsTable from "./components/PositionsTable.vue";
	import MetaTable from "./components/MetaTable";
	import PriceEvaluationsTable from "./components/PriceEvaluationsTable.vue";
	import PriceChart from "./components/PriceChart";
	import ButtonEvaluatePrice from "./components/ButtonEvaluatePrice";

	export default {
		name: "App",
		components: {
			PositionsTable,
			MetaTable,
			PriceEvaluationsTable,
			PriceChart,
			ButtonEvaluatePrice
		},
		data: () => ({
			isLoading: false
		}),
		created() {
			this.isLoading = true;
		},
		mounted() {
			setTimeout(() => this.isLoading = false, 500);
		}
	};
</script>
