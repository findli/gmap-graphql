let _ = require("underscore");

const graphql = require('graphql');
const {GraphQLObjectType, GraphQLList} = graphql;
const LatLngType = require('./LatLngType');

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        randomCoords: {
            type: new GraphQLList(LatLngType),
            resolve() {
                let coords = [];
                for (let i = 0; i < 20; i++) {
                    let x = _.random(0, 1024);
                    let y = _.random(0, 160);
                    coords.push({lat: x, lng: y})
                }
                return coords;
            }
        }
    }
});

module.exports = RootQueryType;
