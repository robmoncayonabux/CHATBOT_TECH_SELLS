const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheet");

const  flowCustomer  = require("./customerFlow");

const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);

const flowCatalog = addKeyword(["1", "4"], { sensitive: true })
  .addAnswer("Te envío el catalogo")
  .addAnswer(
    "Abre el catalogo e indicame que producto deseas! *_Cargando Archivo_* 🤖"
  )
  .addAnswer(
    "¯\_(ツ)_/¯",
    {
      media:
        "https://drive.google.com/uc?export=view&id=1koq6LnxKtWzHR9ApKwdsp6y9zH5S_C18",
    },
    null
  )
  .addAnswer(
    ["Escribeme el *codigo* del producto que deseas, espero tu respuesta! 🤖"],
    { capture: true },
    async (ctx, { fallBack, flowDynamic, gotoFlow }) => {
      const targetCode = ctx.body;
      try {
        const getProduct = await googleSheet.showResult0(targetCode);
        console.log(getProduct);
        if (getProduct === null) {
          fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(    
    "Excelente elección! comencemos con la solicitud de compra!", null,     
    async (_, {gotoFlow }) => {
      gotoFlow(flowCustomer)
    })


const flowPrint3D = addKeyword("2", { sensitive: true })
  .addAnswer(
    [
      "Encantado de mostrarte como va el pedido de las impresiones 3D!",
      "",
      "Cual es tu numero de pedido? ✌🏻😎",
    ],
    {
      capture: true,
    },
    async (ctx, { flowDynamic, fallBack }) => {
      const targetCode = ctx.body;
      try {
        const getProduct = await googleSheet.showResult1(targetCode);
        if (getProduct === null) {
          return fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        flowDynamic(
          `Su pedido con numero de cliente *${getProduct.NumeroCliente}* se encuentra en estado *${getProduct.proceso}* 🤓`
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
const flowVcard = addKeyword("6", { sensitive: true })
  .addAnswer(
    "Un gusto darte el contacto de quien te atendera!",
    null,
    async (ctx, { provider }) => {
      // send a contact!
      const vcard =
        "BEGIN:VCARD\n" + // metadata of the contact card
        "VERSION:3.0\n" +
        "FN:Yeyo Reyes\n" + // full name
        "ORG:Programador de la Muerte;\n" + // the organization of the contact
        "TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n" + // WhatsApp ID + phone number
        "END:VCARD";
      const sentMsg = await sock.sendMessage(id, {
        contacts: {
          displayName: "Yeyo",
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

const flowSorteo = addKeyword("2", { sensitive: true })
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

  

module.exports = {
  flowPrint3D,
  flowCatalog,
  flowSorteo,
  flowVcard
};
