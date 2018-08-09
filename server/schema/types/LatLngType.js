const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLFloat,
} = graphql;

const LatLngType = new GraphQLObjectType({
    name: 'LatLngType',
    fields: {
        lat: {type: GraphQLFloat},
        lng: {type: GraphQLFloat}
    }
});

module.exports = LatLngType;
