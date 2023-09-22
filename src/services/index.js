require('dotenv').config();
const { JWT } = require("google-auth-library");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

class GoogleSheetService {
  constructor(id) {
    if (!id) {
      throw new Error("ID_UNDEFINED");
    }

    this.jwtFromEnv = new JWT({
     
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: SCOPES,
    });
    
    this.doc = new GoogleSpreadsheet(id, this.jwtFromEnv);
  }

  // Recuperar la lista de GoogleSheet
  async retriveStockList() {
    try {
        const list = [];
        await this.doc.loadInfo();
        const sheet = this.doc.sheetsByIndex[0];  // la primera hoja
        await sheet.loadCells("A1:H7");
        
        for (let rowIndex = 1; rowIndex <= 5; rowIndex++) {  // Suponiendo que las filas de datos comienzan en la fila 2 (índice 1)
            const item = {
                Item: sheet.getCell(rowIndex, 0).value,
                Codigo: sheet.getCell(rowIndex, 1).value,
                Nombre: sheet.getCell(rowIndex, 2).value,
                Categoria: sheet.getCell(rowIndex, 3).value,
                Descripcion: sheet.getCell(rowIndex, 4).value,
                Stock: sheet.getCell(rowIndex, 5).value,
                Precio: sheet.getCell(rowIndex, 6).value
            };
            list.push(item);
            console.log(item);  // Imprimir cada item para verificar los valores
        }
        
        return list;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}



  // Guardar pedido
  async saveOrder(data) {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[1]; // the first sheet

    const order = await sheet.addRow({
      fecha: data.fecha,
      telefono: data.telefono,
      nombre: data.nombre,
      pedido: data.pedido,
      observaciones: data.observaciones,
    });

    return order;
  }
}

module.exports = GoogleSheetService;
