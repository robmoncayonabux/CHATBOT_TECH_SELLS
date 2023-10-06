const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const { flowCatalog, flowVcard, flowCatalogGamer, flowUbication } = require('./answerFlow');
const {  flowPrint3D, flowPrint3DCustom } = require('./answer3DFlow');



const flowWelcome = addKeyword(EVENTS.WELCOME)
  .addAnswer([
    "¡Hola! Bienvenido al servicio de atención al cliente de Computerías",
    "Seré tu asistente virtual y estoy aquí para ayudarte. ¿En qué te puedo asistir hoy?",
  ])
  .addAnswer(
    [
      "*MENU PRINCIPAL*",
      "1. Venta de computadores y equipos. 🛒",
      "2. Impresión 3D. 🎨",
      "3. Creaciones 3D personalizadas. 👨🏻‍🎨",
      "4. Ubicación para atención, mantenimientos y reparaciones. 🔧",
      "5. Consolas y Juegos. 🎮",
      "6. Sorteos activos. 🏆",
      "7. Hablar con un agente en vivo. 🙍🏻‍♂️",
      "",
      "Puedes escribir en cualquier momento *CANCELAR* para cancelar el pedido!",
      "",
      "Por favor escribe el *numero* de la opcion que necesites! 🙇🏻‍♂️",
    ],

    { capture: true, delay: 400 },

    async (ctx, { fallBack }) => {
      console.log('La informacion del cliente', ctx)
      const clientAnswer = ctx.body;
      if (!["1", "2", "3", "4", "5", "6", "7"].includes(clientAnswer) ) {
        return fallBack("Whoops! no me has dado un numero que pertenezca a la lista! 😫");
      } 
    }, 
    [flowCatalog, flowPrint3D, flowVcard, flowCatalogGamer, flowPrint3DCustom, flowUbication]
  );

  const flowCancel = addKeyword("CANCELAR", { sensitive: true }).addAnswer(
    "TODO QUEDO CANCELADO! ESCRIBE CUALQUIER COSA PARA VOLVER AL MENU PRINCIPAL! 🙉🙉",
    null,
    async (_, endFlow) => {
      endFlow()
    }
  );

  module.exports = { flowWelcome, flowCancel };
