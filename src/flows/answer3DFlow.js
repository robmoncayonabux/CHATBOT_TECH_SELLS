const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheet");

const { flowCustomer3D, flowCustomer3DCUSTOM } = require("./customer3DFlow");

const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);

const flowPrint3D = addKeyword("3", { sensitive: true })
  .addAnswer(
    [
      "Encantado de atenderte en la opcion de impresiones 3D!",
      "",
      "*ELIGE UNA OPCION*",
      "1. Deseo hacer un pedido 📝",
      "2. Deseo saber como va mi pedido 🔍",
    ],
    {
      capture: true,
    },
    async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
      const clientAnswer = ctx.body;
      if (!["1", "2"].includes(clientAnswer)) {
        fallBack(
          "Whoops! no me has dado un numero que pertenezca a la lista! 😫"
        );
      }
      if (clientAnswer === "1") {
        gotoFlow(flowPrint3Dopt1);
      }
      if (clientAnswer === "2") {
        flowDynamic("Cual es tu codigo de pedido? ✌🏻😎");
      }
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, endFlow }) => {
      try {
        const targetCode = ctx.body;
        if (targetCode === "CANCELAR") {
          return endFlow({
            body: "❌ Su solicitud ha sido cancelada, escribe cualquier palabra para regresar al MENU PRINCIPAL ❌",
          });
        }
        const getProduct = await googleSheet.showResultPrint3D(targetCode);
        if (getProduct === null) {
          return fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        flowDynamic(
          `Su pedido con numero de cliente *${getProduct.pedido}* se encuentra en estado *${getProduct.proceso}* 🤓.\nEscribe cualquier cosa para el menu principal!`
        );
      } catch (error) {
        console.log(error);
      }
    }
  );

const flowPrint3Dopt1 = addKeyword(EVENTS.ACTION)
  .addAnswer("Te envío el catalogo de nuestros pedidos mas solicitados")
  .addAction(async (_, { flowDynamic }) => {
    try {
      const getProduct = await googleSheet.GiveList3D();
      return flowDynamic(`Lista de items:\n${getProduct.Mensaje} `);
    } catch (error) {
      console.log(error);
    }
  })
  .addAnswer(
    ["Escribeme el *ITEM* del producto que deseas, espero tu respuesta! 🤖"],
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic, endFlow }) => {
      const targetCode = ctx.body;
      try {
        if (targetCode === "CANCELAR") {
          return endFlow({
            body: "❌ Su solicitud ha sido cancelada, escribe cualquier palabra para regresar al MENU PRINCIPAL ❌",
          });
        }
        const getProduct = await googleSheet.showResultList3D(targetCode);
        if (getProduct === null) {
          fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        state.update({
          productItem: getProduct.item,
          productname: getProduct.Nombre,
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
    async (ctx, { state, flowDynamic, fallBack, gotoFlow }) => {
      const numberValue = parseFloat(ctx.body);

      if (!isNaN(numberValue) && Number.isInteger(numberValue)) {
        state.update({ productAmount: ctx.body });
        const currentState = state.getMyState();
        flowDynamic(
          `*USTED A PEDIDO*: ${currentState.productname}\n*CANTIDAD*: ${currentState.productAmount} 🤯`
        );
        flowDynamic(
          "Excelente elección! comencemos con la solicitud de compra!"
        );
        gotoFlow(flowCustomer3D);
      } else {
        fallBack("Ayy... eso no es un numero! Vuelvelo a intentar! 🔢😥");
      }
    }
  );

const flowPrint3DCustom = addKeyword("2", { sensitive: true })
  .addAnswer(
    [
      "Encantado de atenderte en la opcion de impresiones 3D!",
      "",
      "*ELIGE UNA OPCION*",
      "1. Envianos tu link con refencia 📝",
      "2. Deseo saber como va mi pedido 🔍",
    ],
    {
      capture: true,
    },
    async (ctx, { flowDynamic, fallBack, gotoFlow }) => {
      const clientAnswer = ctx.body;
      if (!["1", "2"].includes(clientAnswer)) {
        fallBack(
          "Whoops! no me has dado un numero que pertenezca a la lista! 😫"
        );
      }
      if (clientAnswer === "1") {
        gotoFlow(flowCustomer3DCUSTOM);
      }
      if (clientAnswer === "2") {
        flowDynamic("Cual es tu codigo de pedido? ✌🏻😎");
      }
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, endFlow }) => {
      try {
        const targetCode = ctx.body;
        if (targetCode === "CANCELAR") {
          return endFlow({
            body: "❌ Su solicitud ha sido cancelada, escribe cualquier palabra para regresar al MENU PRINCIPAL ❌",
          });
        }
        const getProduct = await googleSheet.showResultPrint3D(targetCode);
        if (getProduct === null) {
          return fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        flowDynamic(
          `Su pedido con numero de cliente *${getProduct.pedido}* se encuentra en estado *${getProduct.proceso}* 🤓.\nEscribe cualquier cosa para el menu principal!`
        );
      } catch (error) {
        console.log(error);
      }
    }
  );

module.exports = {
  flowPrint3D,
  flowPrint3DCustom,
  flowPrint3Dopt1,
};
