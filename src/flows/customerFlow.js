const { getDay } = require("date-fns");

const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheet");
const  { generateCustomerCode }  = require("../utils/codeClientGenerator");

const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);
const flowCustomer = addKeyword(EVENTS.ACTION, { delay: 700 })
  .addAnswer([
    "Empecemos con tu solicitud!",
    "",
    "Ahora necesitare tu información! ✌🏻😎",
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
    "¿De qué ciudad nos escribes?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ city: ctx.body });
    }
  )
  .addAnswer(
    "¿Cuál es tu dirección?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ direction: ctx.body });
    }
  )
  .addAnswer(
    "¿Quieres envío a domicilio?",
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const clientAnswer = ctx.body;
      if (!["si", "no", "Si", "No"].includes(clientAnswer)) {
        fallBack("Whoops! solo dime que *si* o que *no*! 😫");
      }
      state.update({ delivery: clientAnswer });
    }
  )
  .addAnswer(
    "¿Alguna observación sobre este pedido?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ observation: ctx.body });
    }
  )
  .addAnswer(
    "Estamos guardando los detalles de tu pedido... por favor espera",
    null,
    async (ctx, { state }) => {
      const customerCode = generateCustomerCode();
      state.update({
        status: "Pendiente de pago",
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
      const RESPONSE_CODE_MESSAGE = `${currentState.customerCode}`;
      await googleSheet.saveOrder({
        date: new Date().toDateString(),
        customerCode: currentState.customerCode,
        productCode: currentState.productCode,
        price: "",
        delivery: currentState.delivery,
        priceDelivery: "",
        total: "",
        name: currentState.name,
        lastname: currentState.lastname,
        direction: currentState.direction,
        city: currentState.city,
        clientNumber: currentState.clientNumber,
        observation: currentState.observation,
        status: currentState.status,
      });
      flowDynamic(RESPONSE_CODE_MESSAGE);
      return;
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
        gotoFlow(AnotherSell);
        return;
      }
      if (["NO"].includes(clientAnswer)) {
        endFlow();
        return;
      }
    }
  );
const AnotherSell = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["Escribeme el *codigo* del producto que deseas, espero tu respuesta! 🤖"],
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const targetCode = ctx.body;
      try {
        const getProduct = await googleSheet.showResult0(targetCode);
        state.update({ productCode: getProduct.Codigo });
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
    [
      `Perfecto ya llenamos tu solicitud \n Su codigo de pedido es *el mismo*:`,
    ],
    null,
    async (_, { state, flowDynamic }) => {
      const currentState = state.getMyState();
      console.log("Este es mi currentState", currentState);
      flowDynamic(`${currentState.customerCode}`);
      try {
        await googleSheet.saveOrder({
          date: new Date().toDateString(),
          customerCode: currentState.customerCode,
          productCode: currentState.productCode,
          price: "",
          delivery: currentState.delivery,
          priceDelivery: "",
          total: "",
          name: currentState.name,
          lastname: currentState.lastname,
          direction: currentState.direction,
          city: currentState.city,
          clientNumber: currentState.clientNumber,
          observation: currentState.observation,
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
        gotoFlow(AnotherSell);
      }
      if (["NO"].includes(clientAnswer)) {
        endFlow();
      }
    }
  );

module.exports = { flowCustomer, AnotherSell };
