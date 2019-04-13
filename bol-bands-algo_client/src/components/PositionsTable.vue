<template>
	<div>
		<v-data-table :headers="headers" :items="positions">
			<template v-slot:items="props">
				<td>{{ props.item.entry_date }}</td>
				<td>{{ props.item.entry_price }}</td>
				<td>{{ props.item.exit_price }}</td>
				<td>{{ props.item.stop_loss }}</td>
				<td>{{ props.item.action }}</td>
			</template>
		</v-data-table>
	</div>
</template>

<script>
	import PositionsQuery from "../graphql/Positions.gql";

	export default {
		apollo: {
			positions: PositionsQuery
		},
		data: () => ({
			headers: [
				{ text: "Entry Date", value: "entry_date" },
				{ text: "Entry Price", value: "entry_price" },
				{ text: "Exit Price", value: "exit_price" },
				{ text: "Stop Loss", value: "stop_loss" },
				{ text: "Action", value: "action" }
			]
		})
	};
</script>

<style scoped></style>
