import * as React from 'react';
// import Loadable from 'react-loadable';
import MapStatic from "./MapStatic";

/*
const LoadableMap = Loadable({
    loader: () => import(/!* webpackChunkName: "Map" *!/ "./Map"),
    loading: () => (<div>Loading ...</div>)
});
*/

class MapContainer extends React.Component<any, any> {

    render() {
        // return <LoadableMap/>
        return <MapStatic/>
    };
}

export default MapContainer;