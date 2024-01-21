// This code help us coordinates from address
const axios = require('axios');

const optionsCoordinates = {
  method: 'GET',
  url: 'https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi',
  params: {
    address: '10/1C,gopal chatterjee r'
  },
  headers: {
    'X-RapidAPI-Key': 'be8482cefbmsh374639da3e2d61ep107fc1jsnb358ca7d4a07',
    'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
  }
};

try {
  const response =await axios.request(optionsCoordinates);
  console.log(response.data);
} catch (error) {
  console.error(error);
}



// This code will help us to get address from coordinates
const axios = require('axios');

const optionsAddress = {
  method: 'GET',
  url: 'https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi',
  params: {
    lat: '48.85824',
    lng: '2.29451'
  },
  headers: {
    'X-RapidAPI-Key': 'be8482cefbmsh374639da3e2d61ep107fc1jsnb358ca7d4a07',
    'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(optionsAddress);
	console.log(response.data);
} catch (error) {
	console.error(error);
}