import * as React from 'react';
import * as _ from 'underscore';
import * as $ from 'jquery';
import {graphql} from 'react-apollo';
// @ts-ignore
import query from '../../queries/RandomCoords';

class MapStatic extends React.Component<any, any> {
    private map: HTMLImageElement = new Image();
    private map_context: any;
    private drawn: {}[] = [];
    private $people_layer: any;
    private max_map_people: Number = 100;
    private water_context: any;
    private inited: Boolean = false;
    private water = new Image();

    private static color_is_water(bytes: any) {
        let water_color_bytes = [0, 255, 0], our_color_bytes = [bytes[0], bytes[1], bytes[2]];
        return _.isEqual(water_color_bytes, our_color_bytes);
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any): void {
        if (!nextProps.data || !nextProps.data.randomCoords) return;
        if (!this.inited) return;
        for (let i = 0; i < 20; i++) {
            if (this.drawn.length === 100) break;
            let x = nextProps.data.randomCoords[i].lat;
            let y = nextProps.data.randomCoords[i].lng;
            if (-1 !== this.drawn.indexOf({x: x, y: y})) continue;
            // @ts-ignore
            let pixels = this.water_context.getImageData(x, y, 1, 1).data;
            if (MapStatic.color_is_water(pixels)) continue;
            this.$people_layer.append('<div class="person" style="top:' + y + 'px;left:' + x + 'px"></div>');

            this.drawn.push({x: x, y: y});
        }
        if (this.drawn.length < this.max_map_people) {
            this.props.data.refetch();
        }

    }

    public componentDidMount() {
        let latlon = "40.7300694,-74.0024224";

        let interval: any;
        this.$people_layer = $('.people');
        let drawRandom = () => {
            if (!this.props.data || !this.props.data.randomCoords) return;
            this.inited = true;
            clearInterval(interval);

            // this.$people_layer.empty();
            let triesLocal = 0;
            for (let i = 0; i < 20; i++) {
                let x = this.props.data.randomCoords[i].lat;
                let y = this.props.data.randomCoords[i].lng;
                triesLocal++;
                // @ts-ignore
                let pixels = this.water_context.getImageData(x, y, 1, 1).data;
                if (MapStatic.color_is_water(pixels)) continue;
                this.$people_layer.append('<div class="person" style="top:' + y + 'px;left:' + x + 'px"></div>');

                if (-1 === this.drawn.indexOf({x: x, y: y})) {
                    this.drawn.push({x: x, y: y});
                }
            }
            if (this.drawn.length < this.max_map_people) this.props.data.refetch();
        };


        let waterOnload = () => {
            this.water_context.drawImage(this.water, 0, 0, 1024, 256);
            interval = setInterval(drawRandom, 250)
        };

        this.water_context = document.createElement('canvas');
        this.water_context.setAttribute('width', '1024');
        this.water_context.setAttribute('height', '160');

        this.water_context = this.water_context.getContext('2d');

        // @ts-ignore
        this.map_context = $('canvas.map')[0].getContext('2d');

        this.map.crossOrigin = 'http://maps.googleapis.com/crossdomain.xml';
        this.map.src = "http://maps.googleapis.com/maps/api/staticmap?scale=2&center=" + latlon +
            "&zoom=3&size=1024x160&sensor=false&visual_refresh=true&key=AIzaSyAwCNiAoF0F2iDZ__GJdf07gtg9seL-IQk";

        this.map.onload = () => {
            this.map_context.drawImage(this.map, 0, 0, 1024, 256);
            this.water.crossOrigin = 'http://maps.googleapis.com/crossdomain.xml';
            this.water.src = "http://maps.googleapis.com/maps/api/staticmap?scale=2&center=" + latlon +
                "&zoom=3&size=1024x160&sensor=false&visual_refresh=true&style=element:labels|visibility:off&style=feature:water|color:0x00FF00&style=feature:transit|visibility:off&style=feature:poi|visibility:off&style=feature:road|visibility:off&style=feature:administrative|visibility:off&key=AIzaSyASP15b_u1uFphv0r7kwlWtxHWXvsB8ouA";
            this.water.onload = waterOnload
        }
    }

    render() {
        return <div className={'container'}>
            <div className="people"></div>
            <canvas className="map" width="1024" height="160"/>
        </div>
    };
}

export default graphql(query)(MapStatic);