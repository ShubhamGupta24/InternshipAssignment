import React, { useEffect, useRef, useState } from "react";
import { renderToString } from 'react-dom/server';
// import { useMap } from 'react-leaflet/hooks'
import { Marker, Popup, MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import 'react-leaflet-markercluster/dist/styles.min.css';
import { Col, Container, Row } from "react-bootstrap";
import "./style.css";
import { useAuth } from "../Context/Context.jsx";
import axios from "axios";

export const Map = () => {
    const mapRef = useRef();
    const { address, location, getCoords, coords, coordinates, } = useAuth();
    const [position, setPosition] = useState([22.4979097, 88.3190717])
    const [markerData, setMarkerData] = useState([]);
    const [myAddress, setMyAddress] = useState(false);
    const destination = useRef();
    const customIcon = new L.divIcon({
        className: 'custom-icon', // Add any custom class if needed
        html: renderToString(<FaMapMarkerAlt color="red" size={30} />),
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });
    console.log("Hi from Map", coordinates)
    const customIcon2 = new L.divIcon({
        className: 'custom-icon', // Add any custom class if needed
        html: renderToString(<FaMapMarkerAlt color="blue" size={30} />),
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });

    console.log(typeof (destination))

    useEffect(() => {
        setPosition([coordinates.latitude, coordinates.longitude])
        if (!coords) {
            console.log("Hi useEffect from map")
            setMarkerData([
                { id: 1, position: [coordinates.latitude, coordinates.longitude], icon: customIcon },
                { id: 2, position: [coords.latitude, coords.longitude], icon: customIcon2 },
                // Add more locations as needed
            ])


        }
        else {
            setMarkerData([{ id: 1, position: [coordinates.latitude, coordinates.longitude], icon: customIcon }])
        }


    }, [coordinates])

    const myLocation = async () => {
        if (address)
            setMyAddress(true)
        else if (coordinates) {

            console.log("I am from", location());
            const res = await location();
            console.log(res)
            setMyAddress(true)
        }
        else {
            setMyAddress(false)
            alert("Coordinates Not Found");
        }
    }
    // Function to plot the route
    const plotRoute = async () => {
        console.log("Hi plot1 from Map.js") // San Francisco, CA
        if (!mapRef.current) {
            console.log("Initializing the map...");
            const map = L.map('map').setView(position, 12); // San Francisco, CA
            L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IaxuUc5MPMSu7ZhCgNj5").addTo(map);
            mapRef.current = map;

            const origin = L.latLng(coordinates.latitude, coordinates.longitude); // San Francisco, CA
            const destination = L.latLng(coords.latitude, coords.longitude); // Kolkata, India

            L.marker(origin, { icon: customIcon }).addTo(map);
            L.marker(destination).addTo(map);

            L.Routing.control({
                waypoints: [L.latLng(origin), L.latLng(destination)],
                routeWhileDragging: true,
            }).addTo(map);
        }
    };

    const find = async () => {
        const res = await getCoords(destination);
        console.log("hi getcoords res from map", res)
        plotRoute()
    }

    const handleChange = (e) => {
        e.preventDefault();
        console.log(e);
        const value = destination.current.value;
        console.log(value)
        // setDestination({ ...destination, [e.target.name]: e.target.value });
    }
    console.log("Hi coords from map", coords)
    // let position = [coordinates.latitude, coordinates.longitude]
    console.log(position, "opop")
    return (
        <div className="main">
            <Container style={{ color: "white", display: "block", position: "relative" }} >
                <Row style={{ height: "40vmax" }}>
                    <Col
                        style={{
                            padding: '15px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: "10px",
                            border: '2px solid white',
                            margin: '1%'
                        }}>
                        <h1>Hi Column 2</h1>
                        {
                            !myAddress ?
                                (<button className='bttn' onClick={myLocation}>GetMyLocation</button>)
                                : (<><label className='input'>Address : {address}</label></>)
                        }

                        <div style={{ display: "flex", }}>
                            <label className='input'
                                style={{ paddingBottom: "1.5vmin" }}
                            >Final Destination:</label>
                            <input
                                className='accept'
                                placeholder="Enter destination here"
                                id='destination'
                                name='destination'
                                autoComplete='off'
                                onChange={handleChange}
                                ref={destination} />
                        </div>
                        <div>
                            <button className="bttn" onClick={find}>Find my route</button>
                        </div>
                    </Col>
                    <Col
                        style={{
                            padding: '15px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: "10px",
                            border: '2px solid white',
                            margin: '1%',
                            objectFit: "cover",
                            width: '100%',
                            height: '100%'
                        }}>
                        <h2>map by OpenStreetMap</h2>
                        {console.log(position, "popoop")}
                        <div id="map" style={{ height: '300px' }}>
                            <MapContainer center={position} zoom={15} scrollWheelZoom={false} height={100} >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.maptiler.org/copyright">Maptiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IaxuUc5MPMSu7ZhCgNj5"
                                />
                                {markerData.map((marker) => (
                                    <Marker key={marker.id} position={marker.position} icon={marker.icon}>
                                        <Popup>
                                            <div>
                                                <h3>Marker {marker.id}</h3>
                                                <p>Location: {marker.position.toString()}</p>

                                                {marker.id === 2 ? <p>Your Destination</p> : <p>Your Location</p>}

                                            </div>
                                        </Popup>
                                    </Marker>))}
                            </MapContainer>
                        </div>
                    </Col>
                </Row>

            </Container>
        </div >

    );
}
