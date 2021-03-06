import {makeExecutableSchema} from 'graphql-tools';
import {merge} from 'lodash';
import {GraphQLDateTime} from 'graphql-iso-date'
import {typeDefs as Position, resolvers as positionResolver} from './modules/position.module';
import {typeDefs as PriceSnapshot, resolvers as priceSnapshotResolver} from './modules/priceSnapshot.module';
import {typeDefs as PriceEvaluation, resolvers as priceEvaluationResolver} from './modules/priceEvaluation.module';
import {typeDefs as Meta, resolvers as metaResolver} from './modules/meta.module';

const rootTypeDefs = `
    scalar DateTime

    type Query {
        message: String
    }
`;

const rootResolver = {
	DateTime: GraphQLDateTime,

	Query: {
		message: () => 'hello'
	}
};

export const schema = makeExecutableSchema({
	typeDefs: [rootTypeDefs, Position, PriceSnapshot, PriceEvaluation, Meta],
	resolvers: merge(rootResolver, positionResolver, priceSnapshotResolver, priceEvaluationResolver, metaResolver)
});
