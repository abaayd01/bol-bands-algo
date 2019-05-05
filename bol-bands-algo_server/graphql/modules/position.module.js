import Position from '@models/Position'
import gql from 'graphql-tag'
import {PubSub} from 'apollo-server-express'

const pubSub = new PubSub();

const POSITION_ADDED = 'POSITION_ADDED';
const POSITION_DELETED = 'POSITION_DELETED';
const POSITION_UPDATED = 'POSITION_UPDATED';

// position.module.js
export const typeDefs = gql`
    input PositionInput {
        entry_price: Float
        exit_price: Float
        stop_loss: Float
        action: String
        entry_date: DateTime
        exit_date: DateTime
        percentage_profit: Float
        is_open: Boolean
        outcome: String
    }

    type PositionId {
        _id: String
    }

    type Position {
        _id: String
        entry_price: Float
        exit_price: Float
        stop_loss: Float
        action: String
        entry_date: DateTime
        exit_date: DateTime
        percentage_profit: Float
        is_open: Boolean
        outcome: String
    }

    extend type Query {
        positions: [Position]
        position(positionId: String): Position
    }

    type Mutation {
        createPosition(input: PositionInput): Position
        updatePosition(positionId: String, input: PositionInput): Position

        deletePosition(positionId: String): PositionId
    }

    type Subscription {
        positionAdded: Position
        positionUpdated: Position
        positionDeleted: PositionId
    }
`

export const resolvers = {
	Query: {
		positions: async () => await Position.find({}),
		position: async (_, {positionId}) => await Position.findOne({_id: positionId})
	},

	Mutation: {
		createPosition: async (_, {input}) => {
			const newPosition = new Position({
				...input,
				exit_date: null,
				percentage_profit: null,
				is_open: true,
				outcome: null
			});

			try {
				await newPosition.save();

				pubSub.publish(POSITION_ADDED, {
					positionAdded: newPosition
				});

				return newPosition
			} catch (err) {
				throw err
			}
		},
		updatePosition: async (_, {positionId, input}) => {
			const updatedPosition = await Position.findOneAndUpdate({_id: positionId},
				{
					...input
				},
				{new: true})

			pubSub.publish(POSITION_UPDATED, {
				positionUpdated: updatedPosition
			});

			return updatedPosition
		},
		deletePosition: async (_, {positionId}) => {
			try {
				await Position.findOneAndDelete({_id: positionId})

				pubSub.publish(POSITION_DELETED, {
					positionDeleted: {
						_id: positionId
					}
				});

				return {
					_id: positionId
				}
			} catch (err) {
				return 'err'
			}
		}
	},

	Subscription: {
		positionAdded: {
			subscribe: () => pubSub.asyncIterator([POSITION_ADDED])
		},
		positionUpdated: {
			subscribe: () => pubSub.asyncIterator([POSITION_UPDATED])
		},
		positionDeleted: {
			subscribe: () => pubSub.asyncIterator([POSITION_DELETED])
		}
	}
};
