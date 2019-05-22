<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container>
        <v-toolbar flat>
            <v-toolbar-title>Price Evaluations</v-toolbar-title>
        </v-toolbar>
        <v-data-table :headers="headers" :items="priceEvaluations" :pagination.sync="pagination">
            <template v-slot:items="props">
                <td>{{ props.item.date | moment('YYYY-MM-DD hh:mm') }}</td>
                <td>{{ props.item.price }}</td>
                <td>{{ props.item.exit_price }}</td>
                <td>{{ props.item.stop_loss }}</td>
                <td>{{ props.item.action }}</td>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
	import PriceEvaluationsQuery from "../graphql/priceEvaluation/PriceEvaluations.gql";

	export default {
		apollo: {
			priceEvaluations: {
				query: PriceEvaluationsQuery
			}
		},
		data: () => ({
			headers: [
				{text: "Date", value: "date"},
				{text: "Price", value: "Price"},
				{text: "Exit Price", value: "exit_price"},
				{text: "Stop Loss", value: "stop_loss"},
				{text: "Action", value: "Action"},
			],
            pagination: {
				rowsPerPage: 10,
                sortBy: 'date',
                descending: true
            }
		})
	};
</script>

<style scoped>
</style>
