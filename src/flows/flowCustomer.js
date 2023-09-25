const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/index");

const {getDay} = require ("date-fns")

const {generateCustomerCode} = require ('../services/inventory/codeClientGenerator')

const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);

const flowCustomer = addKeyword("3", { sensitive: true })
  .addAnswer([
    "Empecemos con tu solicitud!",
    "",
    "Ahora necesitare tu información! ✌🏻😎",
  ])
  .addAnswer(
    "¿Cuál es tu nombre?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ name: ctx.body });
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
    "¿Cual es tu dirección?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ direction: ctx.body });
    }
  )
  .addAnswer(
    "¿Quieres delivery?",
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const clientAnswer = ctx.body;
      if (!["si", "no"].includes(clientAnswer)) {
      fallBack("Whoops! solo dime que *si* o que *no*! 😫");
      }
      state.update({ delivery: clientAnswer });
      return;
    }
  )
  .addAnswer(
    "¿Alguna observación sobre este pedido?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ observation: ctx.body });
    }
  )
  .addAction(async (_, { state }) => {
    state.update({ status: "Pendiente de pago" });
  })
  .addAction(async (ctx, { state }) => {
    const customerNumber = ctx.from;
    console.log("Numero del cliente", customerNumber)
    state.update({ clientNumber: customerNumber });
  })
  .addAction(
    async (_, { }) => {
    customerCode = generateCustomerCode();
    return console.log("Codigo del cliente", customerCode );
  })
  .addAnswer(
    "Perfecto ya llenamos tu solicitud",
    null,
    async (_, { state }) => {
      const currentState = state.getMyState();
      try {
        await googleSheet.saveOrder({
          date: new Date().toDateString(),
          clientNumber: currentState.clientCode,
          productCode: "",
          price: "",
          delivery: currentState.delivery,
          priceDelivery: "",
          total: "",
          name: currentState.name,
          lastname: currentState.lastname,
          direction: currentState.direction,
          city: currentState.city,
          clientNumber:currentState.clientNumber,
          observation: currentState.observation,
          status: currentState.status
        });
      } catch (error) {
        console.log(error);
      }
    }
  );

  module.exports = flowCustomer