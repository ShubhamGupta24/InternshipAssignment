// MapComponent.js
import React, { useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { FaMapMarkerAlt } from "react-icons/fa";
import { LiaMapMarkerSolid } from "react-icons/lia";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const MapComponent = () => {
    const mapRef = useRef(null);
    const customIcon = new L.divIcon({
        className: 'custom-icon', // Add any custom class if needed
        html: renderToString(<FaMapMarkerAlt color="red" size={30} />),
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });
    useEffect(() => {
        if (!mapRef.current) {
            console.log("Initializing the map...");
            const map = L.map('map').setView([37.7749, -122.4194], 12); // San Francisco, CA
            L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IaxuUc5MPMSu7ZhCgNj5").addTo(map);
            mapRef.current = map;

            const origin = L.latLng(28.6139, 77.2090); // San Francisco, CA
            const destination = L.latLng(22.5726, 88.3639); // Kolkata, India

            L.marker(origin, { icon: customIcon }).addTo(map);
            L.marker(destination).addTo(map);

            L.Routing.control({
                waypoints: [L.latLng(origin), L.latLng(destination)],
                routeWhileDragging: true,
            }).addTo(map);
        }

        // Cleanup function to remove the map when the component is unmounted
        return () => {
            // console.log("Cleaning up the map...");
            // if (mapRef.current) {
            //     mapRef.current.remove();
            //     mapRef.current = null;
            // }
        };
    }, []);

    return (
        <div id="map" style={{ height: '400px' }}>
            <MapContainer center={[28.6139, 77.2090]} zoom={12}>
                <TileLayer url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IaxuUc5MPMSu7ZhCgNj5" />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
