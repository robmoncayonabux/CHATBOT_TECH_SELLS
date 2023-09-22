const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/index");

const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);

const GLOBAL_STATE = [];

const flowVenta = addKeyword("1").addAnswer(
  "Encantado de mostrarte lo que tenemos en stock!",
  null,
  async (_, { flowDynamic }) => {
    try{
    const getList = await googleSheet.retriveStockList();
    for (const stockList of getList) {
      GLOBAL_STATE.push(stockList);
      await flowDynamic(stockList);
    }
  }
  catch(error){
    console.log(error)
  }
});


const flowPedidos3D = addKeyword("2").addAnswer(
  "Encantado de mostrarte como va el pedido de las impresiones 3D!",
  null,
  async (_, { flowDynamic }) => {
    try{
    const getList = await googleSheet.retrive3DList();
    for (const stockList3d of getList) {
      GLOBAL_STATE.push(stockList3d);
      await flowDynamic(stockList3d);
    }
  }
  catch(error){
    console.log(error)
  }
});
module.exports = flowPedidos3D;
