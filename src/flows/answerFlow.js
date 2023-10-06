const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheet");

const  {flowCustomer}  = require("./customerFlow");


const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);

const flowCatalog = addKeyword(["1"], { sensitive: true })
  .addAnswer("Te envío el catalogo")
  .addAnswer(
    "Abre el catalogo e indicame que producto deseas! *_Cargando Archivo_* 🤖"
  )
  .addAnswer(
    "Hey, aqui el catalago!",
    {
      media:
        "https://web.seducoahuila.gob.mx/biblioweb/upload/el%20principito.pdf",
    },
    null
  )
  .addAnswer(
    ["Escribeme el *codigo* del producto que deseas, espero tu respuesta! 🤖"],
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const targetCode = ctx.body;
      try {
        const getProduct = await googleSheet.showResultCatalog(targetCode);
        if (getProduct === null) {
          fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        state.update({
          productCode: getProduct.Codigo,
          productname: getProduct.Nombre,
          productPrice: getProduct.Precio
        });
        flowDynamic(`*USTED A PEDIDO*: ${getProduct.Nombre} 😎`);
      } catch (error) {
        return console.log(error);
      }
    }
  )
  .addAnswer(
    "Cuantos deseas? 🔢",
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const numberValue = parseFloat(ctx.body);

      if (!isNaN(numberValue) && Number.isInteger(numberValue)) {
        state.update({ productAmount: ctx.body });
        const currentState = state.getMyState();
        flowDynamic(
          `*USTED A PEDIDO*: ${currentState.productname}\n*CANTIDAD*: ${currentState.productAmount} 🤯`
        );
      } else {
        fallBack("Ayy... eso no es un numero! Vuelvelo a intentar! 🔢😥");
      }
    }
  )
  .addAnswer(
    "Excelente elección! comencemos con la solicitud de compra!",
    { delay: 200 },
    async (ctx, { gotoFlow }) => {
      gotoFlow(flowCustomer);
    }
  );

  const flowUbication = addKeyword("4", { sensitive: true })
    .addAnswer(
      "Visitanos! Esta es nuestra ubicación exacta! 👾⚡",
      null,
      async (ctx, { provider }) => {
        const id = ctx.key.remoteJid;
        const sock = await provider.getInstance();
        // send a location!
        const sentMsg = await sock.sendMessage(id, {
          location: { degreesLatitude: 5.501274, degreesLongitude: -73.8527 },
        });
      }
    )
    .addAction(async (ctx, { provider }) => {
      const id = ctx.key.remoteJid;
      const sock = await provider.getInstance();

      const sentMsg = await sock.sendMessage(id, { text: 'Nuestro Instagram! 🤩🤳🏻\nhttps://www.instagram.com/computerias_/' });
    })
    .addAnswer(
      [
        "Me encanto haberte ayudado!",
        "Escribe cualquier palabra para volver a ver al menu principal! 🥳",
      ],
      { delay: 500 },
      async (_, { endFlow }) => {
        endFlow();
      }
    );

const flowCatalogGamer = addKeyword(["5"], { sensitive: true })
  .addAnswer("Te envío el catalago gamer! 🎮🕹")
  .addAnswer(
    "Abre el catalago gamer e indicame que producto deseas! *_Cargando Archivo_* 🤖"
  )
  .addAnswer(
    "Hey, aqui el catalago gamer! 🎮🕹",
    {
      media:
        "https://web.seducoahuila.gob.mx/biblioweb/upload/el%20principito.pdf",
    },
    null
  )
  .addAnswer(
    ["Escribeme el *codigo* del producto que deseas, espero tu respuesta! 🤖🕹"],
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const targetCode = ctx.body;
      try {
        const getProduct = await googleSheet.showResultCatalogGamer(targetCode);
        if (getProduct === null) {
          fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        state.update({
          productCode: getProduct.Codigo,
          productname: getProduct.Nombre,
          productPrice: getProduct.Precio,
        });
        flowDynamic(`*USTED A PEDIDO*: ${getProduct.Nombre} 😎`);
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(
    "Cuantos deseas? 🔢",
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const numberValue = parseFloat(ctx.body);

      if (!isNaN(numberValue) && Number.isInteger(numberValue)) {
        state.update({ productAmount: ctx.body });
        const currentState = state.getMyState();
        flowDynamic(
          `*USTED A PEDIDO*: ${currentState.productname}\n*CANTIDAD*: ${currentState.productAmount} 🤯`
        );
      } else {
        fallBack("Ayy... eso no es un numero! Vuelvelo a intentar! 🔢😥");
      }
    }
  )
  .addAnswer(
    "Excelente elección! comencemos con la solicitud de compra!",
    { delay: 200 },
    async (_, { gotoFlow }) => {
      gotoFlow(flowCustomer);
    }
  );
  
  const flowSorteo = addKeyword("6", { sensitive: true })
  .addAnswer(
    [
      "Encantado de mostrarte todos nuestros sorteos!",
      "",
      "Cual es tu numero de cliente? ✌🏻😎",
    ],
    {
      capture: true,
    },
    async (ctx, { flowDynamic, fallBack }) => {
      const targetCode = ctx.body;
      try {
        const getProduct = await googleSheet.showResult3(targetCode);
        if (getProduct === null) {
          return fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        flowDynamic(
          `Tenemos el sorte: ${getProduct.nombre} con numero de cliente *${getProduct.NumeroCliente}* se encuentra en estado *${getProduct.proceso}* 🤓`
        );
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(
    [
      "Me encanto haberte ayudado!",
      "Escribe cualquier palabra para volver a ver al menu principal! 🥳",
    ],
    { delay: 500 },
    async (_, { endFlow }) => {
      endFlow();
    }
  );

const flowVcard = addKeyword("7", { sensitive: true })
  .addAnswer(
    "Un gusto darte el contacto de quien te atendera!",
    null,
    async (ctx, { provider }) => {
      // send a contact!
      const vcard =
        "BEGIN:VCARD\n" + // metadata of the contact card
        "VERSION:3.0\n" +
        "FN:Computerias 💻🔧\n" + // full name
        "ORG:Computerias 💻🔧;\n" + // the organization of the contact
        "TEL;type=CELL;type=VOICE;waid=573133160670:+573133160670\n" + // WhatsApp ID + phone number
        "END:VCARD";

      const id = ctx.key.remoteJid;
      const sock = await provider.getInstance();

      const sentMsg = await sock.sendMessage(id, {
        contacts: {
          displayName: "Computerias",
          contacts: [{ vcard }],
        },
      });
    }
  )

  .addAnswer(
    [
      "Me encanto haberte ayudado!",
      "Escribe cualquier palabra para volver a ver al menu principal! 🥳",
    ],
    { delay: 500 },
    async (_, { endFlow }) => {
      endFlow();
    }
  );

module.exports = {
  flowCatalog,
  flowCatalogGamer,
  flowSorteo,
  flowVcard,
  flowUbication
};
