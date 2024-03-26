import { createContext, useContext, useState, useRef, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 })
    const [error, setError] = useState(null);
    const [address, setAddress] = useState("");
    const [coords, setCoords] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        console.log("123")
        try {
            console.log("123")

            if ('geolocation' in navigator) {
                // navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
                // Shubham Always Remember that do not make mistake in the above convention of navigator
                navigator.geolocation.getCurrentPosition(
                    // Success callback
                    function (position) {
                        console.log("hi from context", position);
                        setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                    },
                    // Error callback
                    function (error) {
                        console.error('Error getting location:', error.message);
                        setError('Unable to retrieve location.');
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                setError('Geolocation is not supported by your browser.');
            }
        } catch (error) {
            console.log(error)
        }
        console.log(" hi coordinates", coordinates.current)
        console.log(typeof (coordinates))
    }, [])
    console.log("Hi from Context", coords)

    const getCoords = async (destination) => {
        console.log("Hi destination from getCoords", destination);

        const options = {
            method: 'GET',
            url: 'https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi',
            params: {
                address: destination.current.value
            },
            headers: {
                'X-RapidAPI-Key': '606725f415msh8de2ce24b080a00p19085cjsn2a01d5fc33dc',
                'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log("Hi  response from getCoords", response.data);
            const coordsResult = response.data.Results[0];
            console.log("Coords response Result from Context :", coordsResult);

            setCoords({ latitude: coordsResult.latitude, longitude: coordsResult.longitude })
        } catch (error) {
            console.log("hi error from getCoords", error);
        }
    }



    const location = async () => {
        console.log("lat:", coordinates.latitude);
        console.log("lng:", coordinates.longitude);

        const options = {
            method: 'GET',
            url: 'https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi',
            params: {
                lat: coordinates.latitude,
                lng: coordinates.longitude
            },
            headers: {
                'X-RapidAPI-Key': '606725f415msh8de2ce24b080a00p19085cjsn2a01d5fc33dc',
                'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
            }
        };

        try {
            if (coordinates) {
                const response = await axios.request(options);
                const addressResult = response.data.Results[0];
                console.log(response.data);
                setAddress(addressResult.address);
                console.log(addressResult);
                console.log(addressResult.address);
            } else {
                alert("Coordinates Not Found");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ location, address, getCoords, coords, coordinates }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
}