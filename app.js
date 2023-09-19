const { addKeyword, createBot, createProvider, createFlow, EVENTS} = require('@bot-whatsapp/bot')
const ChatGPTClass = require('./chatgpt.class.js')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const PROMP = require('./promp.js')

const ChatGPTInstance = new ChatGPTClass()

// const createBotChatGPT = async({provider, database}) => {
//   return new ChatGPTClass(database, provider)
// }
const flowConfirmacion = addKeyword('SI CONFIRMO').addAnswer('Su cita a sido programada!')


const flowInicial = addKeyword(EVENTS.WELCOME).addAnswer(
  "Buenas! Bienvenido al Chat del Doctor Don Pepe que se maneja con IA 👨‍💻! Soy Veronica, en que puedo ayudarte?")
  .addAnswer('Solicita una cita con el Doctor Don Pepe! 👨‍⚕️' , null,
  async () => {
    await ChatGPTInstance.handleMsg(PROMP);
  }, [flowConfirmacion]
  );


  const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flowInicial])
    const adapterProvider = createProvider(BaileysProvider);
    
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
