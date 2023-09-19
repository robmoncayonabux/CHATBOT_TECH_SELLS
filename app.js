const { addKeyword, createBot, createProvider, createFlow} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPrecio = require('./flows/flows')
const ticketsSave = require('./ticket/ticket')

let GLOBLAL_STATE = {};

const flowPrincipal = addKeyword("Hola")
  .addAnswer("Hola bienvenido hermano")
  .addAnswer(
    "Ya vamos a comenzar con tu pedido... necesitamos la siguiente info"
  )
  .addAnswer("Cual es tu nombre?", { capture: true }, async (ctx) => {
    GLOBLAL_STATE[ctx.from] = {
      name: ctx.body,
      description: "",
    };
  })
  .addAnswer("Cual es tu direccion?", { capture: true }, async (ctx) => {
    console.log("Este numero escribio", ctx.from);
    GLOBLAL_STATE[ctx.from].direction = ctx.body;
  })
  .addAnswer(
    "Tienes algun codigo?",
    { capture: true },
    async (ctx) => {
      GLOBLAL_STATE[ctx.from].promotion = ctx.body;
      console.log("Esta info es la que se recolecto", GLOBLAL_STATE[ctx.from]);
    }
  )
  .addAnswer("Procesando tu pedido...", null, async (ctx, { flowDynamic }) => {
    const ticketAnswer = await ticketsSave(GLOBLAL_STATE[ctx.from]);
    await flowDynamic(`TU ORDEN/TICKET ES EL # ${ticketAnswer.data.data.id}`);
  });

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
