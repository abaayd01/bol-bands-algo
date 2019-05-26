import {getMeta} from '@lib/FlaskAppInterface';
import gql from 'graphql-tag';

// meta.module.js
export const typeDefs = gql`
	type Meta {
		price: Float
		moving_average_slope: Float
		moving_average: Float
		bol_lower: Float
		bol_upper: Float
	}

	extend type Query {
		meta: Meta
	}
`;

export const resolvers = {
	Query: {
		meta: async () => {
			try {
				const response = await getMeta();
				return response.data;
			}
			catch (err) {
				console.log(err)
			}
		}
	},
};
