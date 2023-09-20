
const { addKeyword, createBot, createProvider, createFlow, EVENTS} = require('@bot-whatsapp/bot')
const ChatGPTClass = require('./chatgpt.class.js')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const PROMPT = require('./promp.js')


const ChatGPTInstance = new ChatGPTClass()

const flowConfirmacion = addKeyword('SI CONFIRMO').addAnswer('Su cita a sido programada!')


const flowInicial = addKeyword("Hola")
  .addAnswer(
    [
      "Buenas! Bienvenido al Chat del Doctor Don Pepe que se maneja con IA 👨‍💻!",
      "Soy Veronica, en que puedo ayudarte?",
    ],
    null,
    async () => {
      try {
        await ChatGPTInstance.handleMsgChatGPT(PROMPT);
      } catch (error) {
        console.log(error)
      }
    }
  )
  .addAnswer(
    "Solicita una cita con el Doctor Don Pepe! 👨‍⚕️",
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
      const response = await ChatGPTInstance.handleMsgChatGPT(ctx.body);
      const message = response.text;
      if (ctx.body.toString() !== "SI CONFIRMO") {
        await fallBack(message);
      }
    },
  [flowConfirmacion]
  );


  const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowInicial])
    const adapterProvider = createProvider(BaileysProvider);
    
    
    createBot({
      flow:adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

  QRPortalWeb();
};

main();
