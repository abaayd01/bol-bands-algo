import Position from '@models/Position';
import gql from 'graphql-tag';
import { GraphQLDateTime } from 'graphql-iso-date';

// position.module.js
export const typeDefs = gql`
    scalar DateTime

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

        deletePosition(positionId: String): String
    }
`;

export const resolvers = {
    DateTime: GraphQLDateTime,

    Query: {
        positions: async () => {
            return await Position.find({});
        },
        position: async (_, { positionId }) => {
            return await Position.findOne({ _id: positionId });
        }
    },

    Mutation: {
        createPosition: async (_, { input }) => {
            const newPosition = new Position({
                ...input,
                exit_date: null,
                percentage_profit: null,
                is_open: true,
                outcome: null
            });

            try {
                return await newPosition.save();
            } catch (err) {
                throw err;
            }
        },
        updatePosition: async (_, { positionId, input }) => {
            return await Position.findOneAndUpdate(
                { _id: positionId },
                {
                    ...input
                },
                { new: true }
            );
        },
        deletePosition: async (_, { positionId }) => {
            try {
                await Position.findOneAndDelete({ _id: positionId });
                return positionId;
            } catch (err) {
                return 'err';
            }
        }
    }
};
