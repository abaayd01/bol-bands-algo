<template>
	<div>
		<v-toolbar flat>
			<v-toolbar-title>Positions</v-toolbar-title>
			<v-divider class="mx-4" inset vertical></v-divider>
			<v-spacer></v-spacer>
			<v-dialog v-model="dialog" max-width="500px">
				<template v-slot:activator="{ on }">
					<v-btn color="info" @click="open">New Position</v-btn>
				</template>
				<v-card>
					<v-card-title>
						<span class="headline">{{ formTitle }}</span>
					</v-card-title>

					<v-card-text>
						<v-container grid-list-md>
							<v-text-field label="Entry Price" type="number"></v-text-field>
							<v-text-field label="Exit Price" type="number"></v-text-field>
							<v-text-field label="Stop Loss" type="number"></v-text-field>
						</v-container>
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
						<v-btn color="blue darken-1" flat @click="save">Save</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-toolbar>

		<v-data-table :headers="headers" :items="positions">
			<template v-slot:items="props">
				<td>{{ props.item.entry_date }}</td>
				<td>{{ props.item.entry_price }}</td>
				<td>{{ props.item.exit_price }}</td>
				<td>{{ props.item.stop_loss }}</td>
				<td>{{ props.item.action }}</td>
				<td class="justify-center layout px-0">
					<v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
					<v-icon small @click="deleteItem(props.item)">delete</v-icon>
				</td>
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
				{ text: "Action", value: "action" },
				{ text: "", value: "" }
			],
			dialog: false,
			formTitle: "Create New Position"
		}),
		methods: {
			open() {
				this.dialog = true;
			},
			close() {
				this.dialog = false;
			},
			save() {
				this.close();
			}
		}
	};
</script>

<style scoped>
</style>
