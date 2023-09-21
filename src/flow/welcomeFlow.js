const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const flowWelcome = addKeyword(EVENTS.WELCOME)
  .addAnswer([
    "¡Hola! Bienvenido al servicio de atención al cliente de Computerías",
    "Seré tu asistente virtual y estoy aquí para ayudarte. ¿En qué te puedo asistir hoy?",
  ])
  .addAnswer(
    [
      "*MENU PRINCIPAL*",
      "1. Venta de computadoras y equipos. 🛒 ",
      "2. Impresión 3D. 🎨",
      "3. Mantenimientos y Reparaciones. 🔧",
      "4. Consolas y Juegos. 🎮",
      "5. Sorteos activos. 🏆",
      "6. Hablar con un agente en vivo. 🙍🏻‍♂️",
      "",
      "Por favor escribe el *numero* de la opcion que necesites! 🙇🏻‍♂️",
    ],

    { capture: true, delay: 700 },

    async (ctx, { fallBack }) => {
      const clientAnswer = ctx.body;
      if (!["1", "2", "3", "4", "5", "6"].includes(clientAnswer)) {
        return fallBack("Whoops! no me has dado un numero! 😵");
      }
    },
    
    [flow1, flow2, flow3, flow4, flow5, flow6]
  )

module.exports = flowWelcome;
