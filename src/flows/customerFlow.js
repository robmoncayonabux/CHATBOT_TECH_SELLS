const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheet");
const { generateCustomerCode } = require("../utils/codeClientGenerator");

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
    "¿Quieres envío a domicilio?\n(Costo adicional dependiendo de la ubicación)",
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
    "Estamos guardando los detalles de tu pedido... por favor espera ⌛",
    null,
    async (ctx, { state }) => {
      const customerCode = generateCustomerCode();
      state.update({
        Status: "Pendiente de pago",
        clientNumber: ctx.from,
        customerCode: customerCode,
      });
    }
  )
  .addAnswer(
    "Perfecto ya llenamos tu solicitud\nSu codigo de pedido es:",
    null,
    async (_, { state, flowDynamic }) => {
      const currentState = state.getMyState();
      flowDynamic(`${currentState.customerCode}`);
      await googleSheet.saveOrder({
        date: new Date().toDateString(),
        customerCode: currentState.customerCode,
        productCode: currentState.productCode,
        price: currentState.productPrice,
        delivery: currentState.delivery,
        productAmount: currentState.productAmount,
        name: currentState.name,
        lastname: currentState.lastname,
        direction: currentState.direction,
        city: currentState.city,
        clientNumber: currentState.clientNumber,
        observation: currentState.observation,
        Status: currentState.Status,
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
        gotoFlow(AnotherSell);
        return;
      }
      if (["NO"].includes(clientAnswer)) {
        endFlow("Con cualquier saludo inicias el Menu Principal! 🤩");
        return;
      }
    }
  );
const flowCustomerSorteo = addKeyword(EVENTS.ACTION, { delay: 700 })
  .addAnswer([
    "Empecemos con tu solicitud!",
    "",
    "Ahora necesitare tu información para el sorteo! ✌🏻😎",
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
  .addAction(async (ctx, { state, provider }) => {
    const id = ctx.key.remoteJid;
    const sock = await provider.getInstance();
    const currentState = state.getMyState();

    const sentMsg = await sock.sendMessage(id, {
      text: `👁‍🗨 Revisa el link para saber que numero queda disponible 👁‍🗨\n${currentState.sorteoLink}`,
    });
  })
  .addAnswer(
    "¿Qué numero de rifa?",
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const currentState = state.getMyState();
      const targetCode = ctx.body;
      try {
        if (isNaN(targetCode) || !Number.isInteger(Number(targetCode)) || Number(targetCode) > Number(currentState.puesto)) {
            fallBack(
                "Ay... ese numero es *mayor* al numero de puestos o *no es un numero*! vuelvelo a intentar nuevamente! 👨🏻‍💻"
            );
            return;
        }
        const getProduct = await googleSheet.showResultRifa(targetCode);
        if (getProduct) {
          fallBack(
            "Ay... ese numero ya esta en uso! vuelvelo a intentar nuevamente! Recuerda revisar la lista! 👨🏻‍💻"
          )
          return
        }
        await state.update({ numeroRifa: targetCode });
        const stateUpdated = state.getMyState();
        await flowDynamic(`*NUMERO DE RIFA*: ${stateUpdated.numeroRifa} 😎`);
      } catch (error) {
        return console.log(error);
      }
    }
  )

  .addAnswer(
    "Estamos guardando los detalles de tu sorteo... por favor espera ⌛",
    null,
    async (ctx, { state }) => {
      state.update({
        telefono: ctx.from,
      });
    }
  )
  .addAnswer(
    "Perfecto ya llenamos tu solicitud! *RECUERDA LAS CONDICIONES 🧠*",
    null,
    async (_, { state }) => {
      const currentState = state.getMyState();
      try {
        await googleSheet.saveOrderRifa({
          date: new Date().toDateString(),
          hour: new Date().toLocaleTimeString(),
          name: currentState.name,
          lastname: currentState.lastname,
          telefono: currentState.telefono,
          numeroRifa: currentState.numeroRifa,
          estado: "Ocupado",
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
        gotoFlow(AnotherSellRifa);
      }
      if (["NO"].includes(clientAnswer)) {
        endFlow("Con cualquier saludo inicias el Menu Principal! 🤩");
        return;
      }
    }
  );
const AnotherSellRifa = addKeyword(EVENTS.ACTION)
  .addAnswer(
    "¿Qué numero de rifa?",
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const targetCode = ctx.body;
      const currentState = state.getMyState();
      try {
        if (isNaN(targetCode) || !Number.isInteger(Number(targetCode)) || Number(targetCode) > Number(currentState.puesto)) {
            fallBack(
                "Ay... ese numero es *mayor* al numero de puestos o *no es un numero*! vuelvelo a intentar nuevamente! 👨🏻‍💻"
            );
            return;
        }
        const getProduct = await googleSheet.showResultRifa(targetCode);
        if (getProduct) {
          fallBack(
            "Ay... ese numero ya esta en uso! vuelvelo a intentar nuevamente! Recuerda revisar la lista! 👨🏻‍💻"
          )
          return
        }
        state.update({ numeroRifa: ctx.body });
        const currentStateUpdate = state.getMyState();
        flowDynamic(`*NUMERO DE RIFA*: ${currentStateUpdate.numeroRifa} 😎`);
      } catch (error) {
        return console.log(error);
      }
    }
  )
  .addAnswer(
    "Estamos guardando los detalles de tu sorteo... por favor espera ⌛",
    null,
    async (ctx, { state }) => {
      state.update({
        telefono: ctx.from,
      });
    }
  )
  .addAnswer(
    "Perfecto ya llenamos tu solicitud! *RECUERDA LAS CONDICIONES 🧠*\n\nEscribe cualquier saludo para volver al menu principal! 😎",
    null,
    async (_, { state }) => {
      const currentState = state.getMyState();
      try {
        await googleSheet.saveOrderRifa({
          date: new Date().toDateString(),
          hour: new Date().toLocaleTimeString(),
          name: currentState.name,
          lastname: currentState.lastname,
          telefono: currentState.telefono,
          numeroRifa: currentState.numeroRifa,
          estado: "Ocupado",
        });
      } catch (error) {
        console.log(error);
      }
    }
  );

const AnotherSell = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["Escribeme el *codigo* del producto que deseas, espero tu respuesta! 🤖"],
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      const targetCode = ctx.body;
      try {
        let products;
        let productName;
        const getProduct = await googleSheet.showResultCatalog(targetCode);
        const getProduct2 = await googleSheet.showResultCatalogGamer(
          targetCode
        );
        if (getProduct === null && getProduct2 === null) {
          fallBack(
              "Ay... ese codigo no esta en mi base de datos! vuelvelo a intentar nuevamente! 👨🏻‍💻"
            );
        }
        
        if (getProduct) {
          products = getProduct.Codigo;
          productName = getProduct.Nombre;
          flowDynamic(`*USTED A PEDIDO*: ${getProduct.Nombre} 😎`);
        }
        if (getProduct2) {
          products = getProduct2.Codigo;
          productName = getProduct2.Nombre;
          flowDynamic(`*USTED A PEDIDO*: ${getProduct2.Nombre} 😎`);
        }

        state.update({
          products: products,
          productname: productName,
        });
      } catch (error) {
        console.log(error);
      }
    })
  .addAnswer(
    "Cuantos deseas? 🔢",
    { capture: true },
    async (ctx, { state, flowDynamic, fallBack }) => {
      const numberValue = parseFloat(ctx.body);

      if (!isNaN(numberValue) && isFinite(ctx.body)) {
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
    [`Perfecto ya llenamos tu solicitud\nSu codigo de pedido es *el mismo*:`],
    null,
    async (_, { state, flowDynamic }) => {
      const currentState = state.getMyState();
      flowDynamic(`${currentState.customerCode}`);

      console.log(currentState)
      try {
        await googleSheet.saveOrder({
          date: new Date().toDateString(),
          customerCode: currentState.customerCode,
          productCode: currentState.productCode,
          price: currentState.productPrice,
          delivery: currentState.delivery,
          productAmount: currentState.productAmount,
          name: currentState.name,
          lastname: currentState.lastname,
          direction: currentState.direction,
          city: currentState.city,
          clientNumber: currentState.clientNumber,
          observation: currentState.observation,
          Status: currentState.Status,
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
        endFlow("Con cualquier saludo inicias el Menu Principal! 🤩");
      }
    }
  );

module.exports = {
  flowCustomer,
  flowCustomerSorteo,
  AnotherSell,
  AnotherSellRifa,
};
