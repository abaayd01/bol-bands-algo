import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { typeDefs as Position, resolvers as positionResolver } from './modules/position.module';

const rootTypeDefs = `
    type Query {
        message: String
    }
`;

const rootResolver = {
    Query: {
        message: () => 'hello'
    }
}

export const schema = makeExecutableSchema({
    typeDefs: [rootTypeDefs, Position],
    resolvers: merge(rootResolver, positionResolver)
});
