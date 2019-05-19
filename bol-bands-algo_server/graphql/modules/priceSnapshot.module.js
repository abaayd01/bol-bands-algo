import PriceSnapshot from '@models/PriceSnapshot';
import gql from 'graphql-tag';

// priceSnapshot.module.js
export const typeDefs = gql`
    type PriceSnapshot {
        _id: String
        marketcap: Float
        price: Float
        volume: Float
        date: DateTime
    }

    extend type Query {
        priceSnapshots: [PriceSnapshot]
    }
`;

export const resolvers = {
	Query: {
		priceSnapshots: async () => await PriceSnapshot.find({}).sort({date: -1})
	},

	Mutation: {},

	Subscription: {}
};
