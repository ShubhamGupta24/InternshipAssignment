import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [address, setAddress] = useState("");
    const location = async (coordinates) => {
        console.log("lat:", coordinates.latitude)
        console.log("lng:", coordinates.longitude)

        const options = {
            method: 'GET',
            url: 'https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi',
            params: {
                lat: coordinates.latitude,
                lng: coordinates.longitude
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_ADDRESS_API_KEY,
                'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
            }
        };

        try {
            if (coordinates) {
                const response = await axios.request(options);
                const addressResult = response.data.Results[0];
                console.log(response.data)
                setAddress(addressResult.address)
                console.log(addressResult);
                console.log(addressResult.address);
            }
            else
                alert("Coordinates Not Found");
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <AuthContext.Provider value={{ location, address }}>
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