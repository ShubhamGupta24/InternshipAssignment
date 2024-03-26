import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import axios from 'axios';

const categories = [
    { label: 'Gas Station', value: 'gas_station' },
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Hotel', value: 'hotel' },
    // Add more categories as needed
];

function Map2() {
    const [waypoints, setWaypoints] = useState([]);
    const [route, setRoute] = useState(null);
    const [startLat, setStartLat] = useState('');
    const [startLng, setStartLng] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!startLat || !startLng || !selectedCategory) {
            alert('Please provide all inputs.');
            return;
        }

        try {
            const response = await axios.get('https://api.openrouteservice.org/v2/pois', {
                params: {
                    api_key: process.env.REACT_APP_OPEN_ROUTE_SERVICES_API_KEY,
                    request: 'pois',
                    geojson: JSON.stringify({
                        type: 'Point',
                        coordinates: [parseFloat(startLng), parseFloat(startLat)]
                    }),
                    filter_category_ids: [selectedCategory]
                }
            });

            const nearestWaypoint = response.data.features[0].geometry.coordinates;
            setWaypoints([nearestWaypoint]);

            if (waypoints.length === 2) {
                const routeResponse = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
                    params: {
                        api_key: process.env.REACT_APP_OPEN_ROUTE_SERVICES_API_KEY,
                        start: `${waypoints[0][1]},${waypoints[0][0]}`,
                        end: `${waypoints[1][1]},${waypoints[1][0]}`
                    }
                });

                setRoute(routeResponse.data.routes[0].geometry.coordinates);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Start Latitude:
                    <input type="text" value={startLat} onChange={(e) => setStartLat(e.target.value)} />
                </label>
                <label>
                    Start Longitude:
                    <input type="text" value={startLng} onChange={(e) => setStartLng(e.target.value)} />
                </label>
                <label>
                    Select Category:
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Select...</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.value}>{category.label}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Find Nearest Waypoint</button>
            </form>

            <MapContainer center={[37.7749, -122.4194]} zoom={4} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {waypoints.map((waypoint, index) => (
                    <Marker position={[waypoint[1], waypoint[0]]} key={index}>
                        <Popup>Nearest Waypoint</Popup>
                    </Marker>
                ))}
                {route && (
                    <Polyline positions={route} color="blue" />
                )}
            </MapContainer>
        </div>
    );
}

export default Map2;
