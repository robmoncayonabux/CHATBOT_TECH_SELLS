
const { addKeyword, createBot, createProvider, createFlow} = require('@bot-whatsapp/bot')
const ChatGPTClass = require('./chatgpt.class.js')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const PROMPT = require('./promp.js')

const ChatGPTInstance = new ChatGPTClass()

let swith = false;

const flowConfirmacion = addKeyword('SI CONFIRMO').addAnswer('Su cita a sido programada!')

const flowReserva = addKeyword('reserva')
.addAction(async(ctx, {flowDynamic, ednFlow}) =>{
  if(!swith){
    await flowDynamic('Estamos cerrados vuelva mañana')
    await ednFlow()
  }
})
.addAnswer('Continuamos con tu reserva...')


const flowOn = addKeyword('prender').addAction(() => swith = true).addAnswer('Me encendi');
const flowOff = addKeyword('apagar').addAction(()=> swith = false).addAnswer('Me apague')

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
    const adapterFlow = createFlow([flowInicial, flowOff, flowOn, flowReserva])
    const adapterProvider = createProvider(BaileysProvider);
    
    
    createBot({
      flow:adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

  QRPortalWeb();
};

main();
