<template>
    <v-app dark>
        <v-content>
            <v-container align-content-center>
                <v-layout row>
                    <v-flex grow pr-2>
                        <price-chart></price-chart>
                    </v-flex>
                    <v-flex shrink pl-2>
                        <price-evaluations-table></price-evaluations-table>
<!--                        <positions-table></positions-table>-->
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
	import PositionsTable from "./components/PositionsTable.vue";
	import PriceEvaluationsTable from "./components/PriceEvaluationsTable.vue";
	import PriceChart from "./components/PriceChart";

	export default {
		name: "App",
		components: {
			PositionsTable,
			PriceEvaluationsTable,
			PriceChart
		}
	};
</script>
