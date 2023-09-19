const { addKeyword } = require('@bot-whatsapp/bot')

const axios = require('axios').default



const API = "https://fakestoreapi.com/products";

const flowPrecio = addKeyword('Precio').addAnswer(
  "Consultando en la base de datos...",
  null,
  async (ctx, { flowDynamic }) => { 
    let contador = 1
    const respuesta = await axios(API);

    for (const item of respuesta.data) {
      if (contador > 3) break;
      contador++;
      flowDynamic({ body: [item.title, ` precio: ${item.price}`], media: item.image })
;
    }
  }
);




module.exports = flowPrecio
