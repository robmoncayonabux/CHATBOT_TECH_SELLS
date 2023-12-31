const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");

const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const QRPortalWeb = require("@bot-whatsapp/portal");
const MockAdapter = require("@bot-whatsapp/database/mock");

const { flowWelcome, flowCancel } = require("./src/flows/principalFlow");
const { flowCustomer,  AnotherSell, flowCustomerSorteo, AnotherSellRifa } = require("./src/flows/customerFlow");
const { flowCustomer3D, Another3DSell, flowCustomer3DCUSTOM } = require("./src/flows/customer3DFlow");
const { flowPrint3Dopt1 } = require("./src/flows/answer3DFlow");

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowWelcome,
    flowCustomer,
    AnotherSell,
    flowCustomer3D,
    flowCancel,
    Another3DSell,
    flowPrint3Dopt1,
    flowCustomerSorteo,
    AnotherSellRifa,
    flowCustomer3DCUSTOM,
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
