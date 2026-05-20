import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/Map.css';
import municipios from '../data/muni-limits.json';
import state_bounds from '../data/state-bounds.json';
import pop_data from '../data/mex-indig-pop.json';
import Popup from "./Popup";

function Map({ selectedState, groupList }) {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const selectedStateRef = useRef(selectedState);

    useEffect(() => {
       selectedStateRef.current = selectedState;
    }, [selectedState]);

    const [popupData, setPopupData] = useState(null);

    const activeGroup = groupList.find(group => group.active);

    const handlePolygonClick = e => {
        setPopupData({
            lngLat: e.lngLat,
            properties: e.features[0].properties
        });
    }

    const handlePolygonMouseMove = e => {
        if (!selectedStateRef.current) return;
        setPopupData({
            lngLat: e.lngLat,
            properties: e.features[0].properties
        });
    }

    const handlePolygonMouseLeave = e => {
        setPopupData(null);
    }

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

            mapRef.current.addLayer({
                id: "population",
                type: "fill",
                source: "population",
                paint: {
                    "fill-color": "rgba(255, 0, 0, 0)"
                }
           });

           mapRef.current.on('click', 'population', handlePolygonClick);
           mapRef.current.on('mousemove', 'population', handlePolygonMouseMove);
           mapRef.current.on('mouseleave', 'population', handlePolygonMouseLeave);
        });

        return () => {
            mapRef.current.remove()
        }
    }, []);

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

    useEffect(()=>{
        if (!mapRef.current) return;
        if (!activeGroup || !selectedState) return;
        if (!mapRef.current.getLayer('population')) return;

        mapRef.current.setFilter('population', [
            "all",
            ["==", ["get", "cve_ent"], selectedState],
            ["==", ["get", "clave_pueblo"], Number(activeGroup.code)]
        ]);

        mapRef.current.setPaintProperty(
            "population",
            "fill-color",
            activeGroup.color
        );

        mapRef.current.setPaintProperty(
            "population",
            "fill-opacity",
            [
                "interpolate",
                ["exponential", 1.2],
                ["coalesce", ["get", "pct_max"], 0],
                0, 0,
                1, 0.2,
                20, 0.35,
                40, 0.5,
                60, 0.65,
                80, 0.8,
                100, 0.95]
        );
    }, [selectedState, groupList]);



    return <div id="map-container" ref={mapContainerRef}>
        <Popup mapRef={mapRef} popupData={popupData} />
    </div>
}

export default Map;