const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const { flowCatalog, flowPrint3D } = require('./answerFlow');


const flowWelcome = addKeyword(EVENTS.WELCOME)
  .addAnswer([
    "¡Hola! Bienvenido al servicio de atención al cliente de Computerías",
    "Seré tu asistente virtual y estoy aquí para ayudarte. ¿En qué te puedo asistir hoy?",
  ])
  .addAnswer(
    [
      "*MENU PRINCIPAL*",
      "1. Venta de Computadores y Equipos. 🛒",
      "2. Impresión 3D. 🎨",
      "3. Mantenimientos y Reparaciones. 🔧",
      "4. Consolas y Juegos. 🎮",
      "5. Sorteos activos. 🏆",
      "6. Hablar con un agente en vivo. 🙍🏻‍♂️",
      "",
      "Por favor escribe el *numero* de la opcion que necesites! 🙇🏻‍♂️",
    ],

    { capture: true, delay: 400 },

    async (ctx, { fallBack }) => {
      console.log('La informacion del cliente', ctx)
      const clientAnswer = ctx.body;
      if (!["1", "2", "3", "4", "5", "6"].includes(clientAnswer) ) {
        return fallBack("Whoops! no me has dado un numero que pertenezca a la lista! 😫");
      } 
    }, 
    [flowCatalog, flowPrint3D]
  );

module.exports = flowWelcome;
