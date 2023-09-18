const { addKeyword, createBot, createProvider, createFlow} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPrecio = require('./flujos/flows')

const flowSaludo = addKeyword("Hola").addAnswer("Escribe Precio", null, null, [flowPrecio]);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowSaludo]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
