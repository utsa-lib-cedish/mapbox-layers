import {useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import mapboxgl from "mapbox-gl";

function Popup({ popupData, mapRef }){

    const popupRef = useRef(new mapboxgl.Popup())
    const containerRef = useRef(document.createElement('div'));

    useEffect(() => {
        if (!mapRef.current) return // wait for map to initialize

        if (!popupData) {
            popupRef.current.remove()
            return
        }

        const { lngLat } = popupData;

        popupRef.current
            .setLngLat(lngLat)
            .setDOMContent(containerRef.current)
            .addTo(mapRef.current)

    }, [mapRef, popupData]);

    useEffect(() => {
        return () => popupRef.current.remove();
    }, []);

    if (!popupData) return null;

    const { properties } = popupData;

    return createPortal(
        <div>
            <h3>Municipality:</h3>
            <p>{properties.nom_mun}</p>
            <h3>People:</h3>
            <p>{properties.nombre_pueblo}</p>
            <h3>Population:</h3>
            <p>{properties.pihogares}</p>
        </div>,
        containerRef.current
    );
}

export default Popup;