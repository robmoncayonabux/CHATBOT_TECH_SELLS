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
    "✨",
    {
      media:
        "http://bibliotecadigital.ilce.edu.mx/Colecciones/ObrasClasicas/_docs/ElPrincipito.pdf",
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
        await flowDynamic(
          "Excelente elección! comencemos con la solicitud de compra!"
        );
        await gotoFlow(flowCustomer);
      } catch (error) {
        console.log(error);
      }
    }
  );


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

module.exports = {
  flowPrint3D,
  flowCatalog,

};
