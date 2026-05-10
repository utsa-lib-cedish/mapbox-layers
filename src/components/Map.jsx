import { useEffect, useRef} from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/Map.css';
import municipios from '../data/muni-limits.json';
import state_bounds from '../data/state-bounds.json';
import pop_data from '../data/mex-indig-pop.json';

function Map({ selectedState, groupList }){
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    const activeGroup = groupList.find(group => group.active);

    console.log(activeGroup);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-103.7294, 23.8002],
            zoom: 4.23,
            style: 'mapbox://styles/mapbox/standard'
        });

        mapRef.current.on('load', () => {
           mapRef.current.addSource('municipios', {
               type: 'geojson',
               data: municipios
           });

           mapRef.current.addSource('population', {
               type: 'geojson',
               data: pop_data
           });

            mapRef.current.addLayer({
                id: 'municipal-limits',
                type: 'line',
                source: 'municipios',
                paint: {
                    "line-width": 0.1,
                }
            });

            mapRef.current.addLayer({
                id: 'municipal-labels',
                type: 'symbol',
                source: 'municipios',
                layout: {
                    "text-field": ['get', 'nomgeo'],
                    "text-size": 10.5
                }
            });

        return () => {
            mapRef.current.remove()
        }
    }, [])


    useEffect(() => {
        if (!mapRef.current) return;
        if (!mapRef.current.getLayer('municipal-limits')) return;
        if (!mapRef.current.getLayer('municipal-labels')) return;

        mapRef.current.setFilter(
            'municipal-limits',
            ['==', ['get', 'cve_ent'], selectedState]
        );

        mapRef.current.setFilter(
            'municipal-labels',
            ['==', ['get', 'cve_ent'], selectedState]
        );

        const bounds = state_bounds[selectedState];

        if (!bounds) return;

        mapRef.current.fitBounds(bounds, {
            padding: 30,
            duration: 1500
        });

    }, [selectedState]);

    return <div id="map-container" ref={mapContainerRef}></div>
}

export default Map;