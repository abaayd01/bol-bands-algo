import PriceEvaluation from '@models/PriceEvaluation'
import gql from 'graphql-tag'

const flaskAppInterface = require('@lib/FlaskAppInterface');

// priceEvaluation.module.js
export const typeDefs = gql`
    type PriceEvaluation {
        _id: String,
		action: String,
		price: Float,
		date: DateTime,
		entry_price: Float,
		exit_price: Float,
		stop_loss: Float
    }

    extend type Query {
        priceEvaluation(id: String): PriceEvaluation
        priceEvaluations: [PriceEvaluation]
    }

    extend type Mutation {
        evaluatePrice(price: Float): PriceEvaluation
    }
`;

export const resolvers = {
	Query: {
		priceEvaluations: async () => await PriceEvaluation.find({}),
		position: async (_, {id}) => await PriceEvaluation.findOne({_id: id})
	},

	Mutation: {
		evaluatePrice: async (_, {price}) => {
			const flaskAppResponse = await flaskAppInterface.evaluatePrice(
				price
			);

			const priceEvaluation = flaskAppResponse.data;

			const newPriceEvaluation = new PriceEvaluation({...priceEvaluation});
			return await newPriceEvaluation.save();
		},
	},
};
