const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/index");

const googleSheet = new GoogleSheetService(
  "1WqK3LZ_dvKg4gIVT6iwhkna2X7RR84odyWvHMtO9xOk"
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


const flowPedidos3D = 
module.exports = flowVenta;
