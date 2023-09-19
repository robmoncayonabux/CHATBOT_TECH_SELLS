const axios = require("axios");
require('dotenv').config();

const API_TOKEN = process.env.API_TOKEN;

const ticketsSave = async (datosEntrantes) => {
  const options = {
    method: 'POST',
    url: 'https://api-v6j99.strapidemo.com/api/tickets',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'insomnia/2023.5.8',
      Authorization: `Bearer ${API_TOKEN}`
    },
    data: JSON.stringify({
      data: datosEntrantes
    })
  };
  return axios(options)
  
  try {
    const response = await axios.request(options);
    console.log(JSON.stringify(response.data));
  } catch (error) {
    console.error(error);
  }
};

module.exports = ticketsSave;

