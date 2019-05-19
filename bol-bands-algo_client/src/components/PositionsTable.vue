<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container mt-2>
        <v-toolbar flat>
            <v-toolbar-title>Positions</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="info" @click="openCreateItem">New Position</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">{{ form_title }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                            <v-datetime-picker label="Entry Date" v-model="entry_date"></v-datetime-picker>
                            <v-text-field label="Entry Price" type="number" v-model="entry_price"></v-text-field>
                            <v-text-field label="Exit Price" type="number" v-model="exit_price"></v-text-field>
                            <v-text-field label="Stop Loss" type="number" v-model="stop_loss"></v-text-field>

                            <span class="subheading grey--text text--darken-1">Action Type</span>
                            <v-radio-group v-model="action_type">
                                <v-radio label="BUY" value="BUY"></v-radio>
                                <v-radio label="SELL" value="SELL"></v-radio>
                            </v-radio-group>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>

                        <v-btn
                                v-if="mode === 'ADD'"
                                color="blue darken-1"
                                flat
                                @click="createNew"
                        >Add
                        </v-btn>
                        <v-btn v-else color="blue darken-1" flat @click="saveChanges">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>

        <v-data-table :headers="headers" :items="positions" :pagination.sync="pagination">
            <template v-slot:items="props">
                <td>{{ props.item.entry_date | moment('YYYY-MM-DD hh:mm') }}</td>
                <td>{{ props.item.entry_price }}</td>
                <td>{{ props.item.exit_price }}</td>
                <td>{{ props.item.stop_loss }}</td>
                <td>{{ props.item.action }}</td>
                <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="openEditItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
	import _ from "lodash";
	import PositionsQuery from "../graphql/position/Positions.gql";

	import CreatePositionMutation from "../graphql/position/PositionCreate.gql";
	import UpdatePositionMutation from "../graphql/position/PositionUpdate.gql";
	import DeletePositionMutation from "../graphql/position/PositionDelete.gql";

	import PositionAddedSubscription from "../graphql/position/PositionAddedSubscription.gql";
	import PositionUpdatedSubscription from "../graphql/position/PositionUpdatedSubscription.gql";
	import PositionDeletedSubscription from "../graphql/position/PositionDeletedSubscription.gql";

	export default {
		apollo: {
			positions: {
				query: PositionsQuery,
				update(queryData) {
					return queryData.positions;
				},
				subscribeToMore: [
					{
						document: PositionAddedSubscription,
						updateQuery: (previous, {subscriptionData}) => {
							const newPositions = [
								...previous.positions,
								subscriptionData.data.positionAdded
							];

							return {
								...previous,
								positions: newPositions
							};
						}
					},
					{
						document: PositionUpdatedSubscription,
						updateQuery: (previous, {subscriptionData}) => {
							const updatedPosition =
								subscriptionData.data.positionUpdated;
							const updatedPositionId = updatedPosition._id;

							const newPositions = previous.positions.map(
								position => {
									if (position._id === updatedPositionId) {
										return updatedPosition;
									}

									return position;
								}
							);

							return {
								...previous,
								positions: newPositions
							};
						}
					},
					{
						document: PositionDeletedSubscription,
						updateQuery: (previous, {subscriptionData}) => {
							const deletedPositionId =
								subscriptionData.data.positionDeleted._id;

							const newPositions = [...previous.positions];

							const indexToDelete = _.findIndex(
								newPositions,
								position => {
									return position._id === deletedPositionId;
								}
							);

							newPositions.splice(indexToDelete, 1);

							return {
								...previous,
								positions: newPositions
							};
						}
					}
				]
			}
		},
		data: () => ({
			headers: [
				{text: "Entry Date", value: "entry_date"},
				{text: "Entry Price", value: "entry_price"},
				{text: "Exit Price", value: "exit_price"},
				{text: "Stop Loss", value: "stop_loss"},
				{text: "Action", value: "action"},
				{text: "", value: ""}
			],
			dialog: false,
			mode: "ADD", // ADD, EDIT
			positionId: null, // if EDIT, id of positionEditing
			form_title: "Create New Position",
			entry_date: new Date().toISOString(),
			entry_price: 0,
			exit_price: 0,
			stop_loss: 0,
			action_type: "BUY", // BUY, SELL
			pagination: {
				rowsPerPage: 5,
				sortBy: 'entry_date',
				descending: true
			}
		}),
		methods: {
			resetForm() {
				this.positionId = null;
				this.entry_date = new Date().toISOString();
				this.entry_price = 0;
				this.exit_price = 0;
				this.stop_loss = 0;
				this.action_type = "BUY";
			},
			openCreateItem() {
				this.mode = "ADD";
				this.dialog = true;
			},
			openEditItem(item) {
				const positionId = item._id;
				this.mode = "EDIT";
				this.positionId = positionId;
				this.form_title = "Edit Position";

				this.entry_date = item.entry_date;
				this.entry_price = item.entry_price;
				this.exit_price = item.exit_price;
				this.stop_loss = item.stop_loss;
				this.action_type = item.action;

				this.dialog = true;
			},
			close() {
				this.dialog = false;
				setTimeout(this.resetForm, 500);
			},
			createNew() {
				this.createPosition();
				this.close();
			},
			async createPosition() {
				await this.$apollo.mutate({
					mutation: CreatePositionMutation,
					variables: {
						input: {
							entry_date: this.entry_date,
							entry_price: parseFloat(this.entry_price),
							exit_price: parseFloat(this.exit_price),
							stop_loss: parseFloat(this.stop_loss),
							action: this.action_type
						}
					}
				});
			},
			saveChanges() {
				this.updatePosition();
				this.close();
			},
			async updatePosition() {
				await this.$apollo.mutate({
					mutation: UpdatePositionMutation,
					variables: {
						positionId: this.positionId,
						input: {
							entry_date: this.entry_date,
							entry_price: parseFloat(this.entry_price),
							exit_price: parseFloat(this.exit_price),
							stop_loss: parseFloat(this.stop_loss),
							action: this.action_type
						}
					}
				});
			},
			deleteItem(item) {
				const positionId = item._id;
				this.deletePosition(positionId);
			},
			async deletePosition(positionId) {
				await this.$apollo.mutate({
					mutation: DeletePositionMutation,
					variables: {
						positionId
					}
				});
			}
		}
	};
</script>

<style scoped>
</style>
