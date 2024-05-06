// MapComponent.js
import React, { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Col, Container, Row } from "react-bootstrap";
import { useAuth } from "../Context/Context.jsx";
import "./style.css";
import { FaMapMarkerAlt } from "react-icons/fa";
// import { LiaMapMarkerSolid } from "react-icons/lia";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const MapComponent = () => {
    const mapRef = useRef(null);
    const { address, location, getCoords, coords, coordinates, } = useAuth();
    // const [position, setPosition] = useState([22.4979097, 88.3190717])
    // const [markerData, setMarkerData] = useState([]);
    const [myAddress, setMyAddress] = useState(false);
    const destination = useRef();
    var customIcon = new L.divIcon({
        className: 'custom-icon', // Add any custom class if needed
        // iconUrl: 'leaf-green.png',
        html: renderToString(<FaMapMarkerAlt color="red" size={30} />),
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });
    const find = async () => {
        const res = await getCoords(destination);
        console.log("hi getcoords res from map", res)
    }
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
    const handleChange = (e) => {
        e.preventDefault();
        console.log(e);
        const value = destination.current.value;
        console.log(value)
        // setDestination({ ...destination, [e.target.name]: e.target.value });
    }
    useEffect(() => {
        if (!mapRef.current) {
            console.log("Initializing the map...");
            const map = L.map('map').setView([28.6139, 77.2090], 12); // San Francisco, CA
            L.tileLayer("https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IaxuUc5MPMSu7ZhCgNj5").addTo(map);
            mapRef.current = map;

            const origin = L.latLng(22.6277668, 88.376053); // San Francisco, CA
            const destination = L.latLng(22.5726, 88.3639); // Kolkata, India

            L.marker(origin, { icon: customIcon }).addTo(map);
            L.marker(destination).addTo(map);

            L.Routing.control({
                waypoints: [L.latLng(origin), L.latLng(destination)],
                routeWhileDragging: true,
            }).addTo(map);
        }
    }, []);

    return (
        <>
            <div className='main'>
                <Container style={{ color: "white", display: "block", position: "relative" }} >
                    <Row style={{ height: "40vmax" }}>
                        <Col
                            style={{
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
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

                    </Row>


                    <div id="map" style={{ height: '100%', padding: '10px', color: 'black', margin: '10px' }}>
                        <MapContainer center={[28.6139, 77.2090]} zoom={12}>
                            <TileLayer url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=IaxuUc5MPMSu7ZhCgNj5" />
                        </MapContainer>
                    </div></Container>
            </div>
        </>
    );
};

export default MapComponent;
