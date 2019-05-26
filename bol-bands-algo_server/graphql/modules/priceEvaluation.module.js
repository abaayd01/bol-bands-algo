import PriceEvaluation from '@models/PriceEvaluation'
import gql from 'graphql-tag'
import {PubSub} from 'apollo-server-express'

const PriceEvaluationTaskRunner = require('@lib/PriceEvaluationTaskRunner');
const flaskAppInterface = require('@lib/FlaskAppInterface');

const pubSub = new PubSub();
const PRICE_EVALUATION_ADDED = 'PRICE_EVALUATION_ADDED';

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
		evaluateCurrentPrice: PriceEvaluation
	}

	extend type Mutation {
		evaluatePrice(price: Float): PriceEvaluation
	}

	extend type Subscription {
		priceEvaluationAdded: PriceEvaluation
	}
`;

export const resolvers = {
	Query: {
		evaluateCurrentPrice: async () => {
			const priceEvaluation = await PriceEvaluationTaskRunner.evaluatePrice();

			console.log(priceEvaluation);
			pubSub.publish(PRICE_EVALUATION_ADDED, {
				priceEvaluationAdded: priceEvaluation
			});

			return priceEvaluation;
		},
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

			pubSub.publish(PRICE_EVALUATION_ADDED, {
				priceEvaluationAdded: newPriceEvaluation
			});

			return await newPriceEvaluation.save();
		},
	},

	Subscription: {
		priceEvaluationAdded: {
			subscribe: () => pubSub.asyncIterator([PRICE_EVALUATION_ADDED])
		},
	}
};
