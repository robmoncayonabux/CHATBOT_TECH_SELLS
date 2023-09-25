require("dotenv").config();
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

  async showResult0(targetCode) {
    try {
      await this.doc.loadInfo("A1:G200");
      const sheet = this.doc.sheetsByIndex[0];
      await sheet.loadCells();


      for (let rowIndex = 1; rowIndex < 100; rowIndex++) {
        const numberCodeCell = sheet.getCell(rowIndex, 1);
        console.log("Comparando:", numberCodeCell.value, String(targetCode)); //Este es un console.log que me verifica si coinciden los #s
        if (String(numberCodeCell.value) === String(targetCode)) {
          const item = {
            item: sheet.getCell(rowIndex, 0).value,
            Codigo: numberCodeCell.value,
            Nombre: sheet.getCell(rowIndex, 2).value,
            Categoria: sheet.getCell(rowIndex, 3).value,
            Descripcion: sheet.getCell(rowIndex, 4).value,
            Stock: sheet.getCell(rowIndex, 5).value,
            Precio: sheet.getCell(rowIndex, 6).value,
          };
          console.log("Item encontrado:", item);
          return item;
        }
      }

      console.log("Código no encontrado.");
      return null;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  async showResult1(targetCode) {
    try {
      await this.doc.loadInfo("A1:G200");
      const sheet = this.doc.sheetsByIndex[1];
      await sheet.loadCells("A1:G200");

      const rows = sheet.rowCount;
      console.log("Número de filas:", rows);

      for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
        const numberClientCell = sheet.getCell(rowIndex, 1);
        console.log("Comparando:", numberClientCell.value, String(targetCode)); //Este es un console.log que me verifica si coinciden los #s
        if (String(numberClientCell.value) === String(targetCode)) {
          const item = {
            fecha: sheet.getCell(rowIndex, 0).value,
            NumeroCliente: numberClientCell.value,
            link: sheet.getCell(rowIndex, 2).value,
            altura: sheet.getCell(rowIndex, 3).value,
            contenido: sheet.getCell(rowIndex, 4).value,
            pintura: sheet.getCell(rowIndex, 5).value,
            observaciones: sheet.getCell(rowIndex, 6).value,
            proceso: sheet.getCell(rowIndex, 7).value,
          };
          console.log("Item encontrado:", item);
          return item;
        }
      }

      console.log("Código no encontrado.");
      return null;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  
  async showResult3(targetCode) {
    try {
      await this.doc.loadInfo("A1:I200");
      const sheet = this.doc.sheetsByIndex[3];
      await sheet.loadCells();

      const rows = sheet.rowCount;
      console.log("Número de filas:", rows);

      for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
        const numberClientCell = sheet.getCell(rowIndex, 1);
        console.log("Comparando:", numberClientCell.value, String(targetCode)); //Este es un console.log que me verifica si coinciden los #s
        if (String(numberClientCell.value) === String(targetCode)) {
          const item = {
            puesto: sheet.getCell(rowIndex, 0).value,
            nombre: numberClientCell.value,
            estado: sheet.getCell(rowIndex, 2).value,
            'Sorteo activo?': sheet.getCell(rowIndex, 3).value,
            'Que se sortea?': sheet.getCell(rowIndex, 4).value,
            puesto: sheet.getCell(rowIndex, 5).value,
            precio: sheet.getCell(rowIndex, 6).value,
          };
          console.log("Item encontrado:", item);
          return item;
        }
      }

      console.log("Código no encontrado.");
      return null;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  

  // Guardar pedido
  async saveOrder(data) {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[2];
    console.log(sheet.title);
    try {
      const order = await sheet.addRow({
        Fecha: data.date,
        'Numero Cliente': data.customerCode,
        'Codigos Producto': "",
        'Precio': "",
        'Envio?': data.delivery,
        'Precio Envio': "",
        Total: "",
        Nombre: data.name,
        Apellido: data.lastname,
        Direccion: data.direction,
        Ciudad: data.city,
        Numero: data.clientNumber,
        Observaciones: data.observation,
        Estatus: data.status,
      });
      console.log("este es el order", order);
      return order;
    } catch (error) {
      throw error;
    }
  }
}



module.exports = GoogleSheetService;
