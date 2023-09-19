const { addKeyword } = require('@bot-whatsapp/bot');

const axios = require('axios').default


const API = "https://fakestoreapi.com/products";

const flowNewCustomer = addKeyword('##$__CUSTOMER__##$').addAnswer(
  "Revisamos la base de datos y Bienvenido  ✨✨");

const flowCustomer = addKeyword('##$__CUSTOMER__##$').addAnswer(
  "Revisamos la base de datos y gracias por ser un cliente fiel!! ✨✨");




module.exports = flowNewCustomer


