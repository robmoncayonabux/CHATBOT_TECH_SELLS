const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");

const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const QRPortalWeb = require("@bot-whatsapp/portal");
const MockAdapter = require("@bot-whatsapp/database/mock");

const { flowWelcome, flowCancel } = require("./src/flows/principalFlow");
const { flowCustomer, flowCustomer3D, AnotherSell } = require("./src/flows/customerFlow");

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowWelcome,
    flowCustomer,
    AnotherSell,
    flowCustomer3D,
    flowCancel,
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
