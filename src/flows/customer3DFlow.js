const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheet");
const { generateCustomerCode } = require("../utils/codeClientGenerator");

const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);

const flowCustomer3D = addKeyword(EVENTS.ACTION)
  .addAnswer("Empecemos con tu solicitud!\nAhora necesitare tu información! ✌🏻😎")
  .addAnswer(
    "¿Cuál es tu nombre?",
    { capture: true },
    async (ctx, { state }) => {
      console.log('ingrese al flow')
      try {
        state.update({ name: ctx.body });
      } catch (err) {
        console.log(err);
      }
    }
  )
  .addAnswer(
    "¿Cuál es tu apellido?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ lastname: ctx.body });
    }
  )
  .addAnswer(
    "Describeme como te gustaria tu pedido! (Detallalo)",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ description: ctx.body });
    }
  )
  .addAnswer(
    "Estamos guardando los detalles de tu pedido... por favor espera ⌛",
    null,
    async (ctx, { state }) => {
      const customerCode = generateCustomerCode();
      state.update({
        status: "En Proceso",
        clientNumber: ctx.from,
        customerCode: customerCode,
      });
    }
  )
  .addAnswer(
    "Perfecto ya llenamos tu solicitud \n Su codigo de pedido es:",
    null,
    async (_, { state, flowDynamic }) => {
      const currentState = state.getMyState();
      flowDynamic(`${currentState.customerCode}`);
      await googleSheet.saveOrderPrint3D({
        date: new Date().toDateString(),
        customerCode: currentState.customerCode,
        name: currentState.name,
        lastname: currentState.lastname,
        clientNumber: currentState.clientNumber,
        productAmount: currentState.productAmount,
        namePrint: currentState.productname,
        description: currentState.description,
        status: currentState.status,
      });
    }
  )
  .addAnswer(
    [
      "Deseas hacer otra compra?",
      'Responde "SI" para continuar, "NO" para regresar al menu principal! 🤖',
    ],
    { capture: true },
    async (ctx, { gotoFlow, endFlow, flowDynamic, fallBack }) => {
      const clientAnswer = ctx.body;
      if (!["NO", "SI"].includes(clientAnswer)) {
        fallBack("Whoops! solo dime que *SI* o que *NO*! 😫");
      }
      if (["SI"].includes(clientAnswer)) {
        flowDynamic("Me encanta!! 🤩");
        gotoFlow(Another3DSell);
        return;
      }
      if (["NO"].includes(clientAnswer)) {
        endFlow("Con cualquier saludo inicias el Menu Principal! 🤩");
        return;
      }
    }
  );

const flowCustomer3DCUSTOM = addKeyword(EVENTS.ACTION, { delay: 600 })
  .addAnswer([
    "Empecemos con tu solicitud!\nAhora necesitare tu información! ✌🏻😎",
  ])
  .addAnswer(
    "¿Cuál es tu nombre?",
    { capture: true },
    async (ctx, { state }) => {
      try {
        state.update({ name: ctx.body });
      } catch (err) {
        console.log(err);
      }
    }
  )
  .addAnswer(
    "¿Cuál es tu apellido?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ lastname: ctx.body });
    }
  )
  .addAnswer(
    "Enviame el link de referencia! 👽",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ productLink: ctx.body });
    }
  )
  .addAnswer(
    "Describeme como te gustaria tu pedido! (Detallalo)",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ description: ctx.body });
    }
  )
  .addAnswer(
    "Perfecto ya llenamos tu solicitud \n Su codigo de pedido es:",
    null,
    async (ctx, { state, flowDynamic, endFlow }) => {
      const customerCode = generateCustomerCode();
      state.update({
        status: "En Proceso",
        clientNumber: ctx.from,
        customerCode: customerCode,
      })
      const currentState = state.getMyState();
      flowDynamic(`${currentState.customerCode}`);
      await googleSheet.saveOrderPrint3D({
        date: new Date().toDateString(),
        customerCode: currentState.customerCode,
        name: currentState.name,
        lastname: currentState.lastname,
        clientNumber: currentState.clientNumber,
        productAmount: currentState.productAmount,
        namePrint: currentState.productLink,
        description: currentState.description,
        status: currentState.status,
      });
      flowDynamic("Te regreso al MENU PRINCIPAL! 😎");
      return endFlow();
    }
  );

const Another3DSell = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["Escribeme el *codigo* del producto que deseas, espero tu respuesta! 🤖"],
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const targetCode = ctx.body;
      try {
        const getProduct = await googleSheet.showResultList3D(targetCode);
        if (getProduct === null) {
          fallBack(
            "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
          );
        }
        state.update({
          productCode: getProduct.item,
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
    async (ctx, { state, flowDynamic, fallBack }) => {
      const numberValue = parseFloat(ctx.body);

      if (!isNaN(numberValue) && isFinite(numberValue)) {
        state.update({ productAmount: ctx.body });
        const currentStateUpdate = state.getMyState();
        console.log("este es el currentstate update", currentStateUpdate)
        flowDynamic(
          `*USTED A PEDIDO*: ${currentStateUpdate.productname}\n*CANTIDAD*: ${currentStateUpdate.productAmount} 🤯`
        );
      } else {
        fallBack("Ayy... eso no es un numero! Vuelvelo a intentar! 🔢😥");
      }
    }
  )
  .addAnswer(
    [`Perfecto ya llenamos tu solicitud\nSu codigo de pedido es *el mismo*:`],
    null,
    async (_, { state, flowDynamic }) => {
      const currentState = state.getMyState();
      console.log("Este es mi currentState", currentState);
      flowDynamic(`${currentState.customerCode}`);
      try {
        await googleSheet.saveOrderPrint3D({
          date: new Date().toDateString(),
          customerCode: currentState.customerCode,
          name: currentState.name,
          lastname: currentState.lastname,
          clientNumber: currentState.clientNumber,
          productAmount: currentState.productAmount,
          namePrint: currentState.productname,
          description: currentState.description,
          status: currentState.status,
        });
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(
    [
      "Deseas hacer otra compra?",
      'Responde "SI" para continuar, "NO" para regresar al menu principal! 🤖',
    ],
    { capture: true },
    async (ctx, { gotoFlow, endFlow, flowDynamic, fallBack }) => {
      const clientAnswer = ctx.body;
      if (!["NO", "SI"].includes(clientAnswer)) {
        fallBack("Whoops! solo dime que *SI* o que *NO*! 😫");
      }
      if (["SI"].includes(clientAnswer)) {
        flowDynamic("Me encanta!! 🤩");
        gotoFlow(Another3DSell);
      }
      if (["NO"].includes(clientAnswer)) {
        endFlow("Con cualquier saludo inicias el Menu Principal! 🤩");
      }
    }
  );

module.exports = {
  flowCustomer3D,
  Another3DSell,
  flowCustomer3DCUSTOM
}