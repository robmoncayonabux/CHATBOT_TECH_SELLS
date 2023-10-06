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

  async showResultCatalog(targetCode) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[0];
      await sheet.loadCells();
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Codigo") === targetCode)
        .map((row) => ({
          item: row.get("Item"),
          Codigo: row.get('Codigo'),
          Nombre: row.get("Nombre"),
          Categoria: row.get("Categoria"),
          Descripcion: row.get("Descripcion"),
          Stock: row.get("Stock"),
          Precio: row.get("Precio"),
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
    } catch (err) {
      console.log(err);
      return 'null';
    }
  }

  async showResultCatalogGamer(targetCode) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[1];
      await sheet.loadCells();
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Codigo") === targetCode)
        .map((row) => ({
          item: row.get("Item"),
          Codigo: row.get("Codigo"),
          Nombre: row.get("Nombre"),
          Categoria: row.get("Categoria"),
          Descripcion: row.get("Descripcion"),
          Stock: row.get("Stock"),
          Precio: row.get("Precio"),
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async showResultList3D(targetCode) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[3];
      await sheet.loadCells();
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Item") === targetCode)
        .map((row) => ({
          item: row.get("Item"),
          Nombre: row.get("Nombre"),
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async showResultPrint3D(targetCode) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[4];
      await sheet.loadCells();
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Pedido") === targetCode)
        .map((row) => ({
          fecha: row.get("Fecha"),
          pedido: row.get("Pedido"),
          nombre: row.get("Nombre"),
          apellido: row.get("Apellido"),
          telefono: row.get("Telefono"),
          cantidad: row.get("Cantidad"),
          piezas: row.get("Tipo Pieza"),
          descripcion: row.get("Descripcion"),
          proceso: row.get("Proceso"),
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async showResult3(targetCode) {
    try {
      await this.doc.loadInfo("A1:I200");
      const sheet = this.doc.sheetsByIndex[SORTEOS];
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
            "Sorteo activo?": sheet.getCell(rowIndex, 3).value,
            "Que se sortea?": sheet.getCell(rowIndex, 4).value,
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
        "Pedido": data.customerCode,
        "Codigos Producto": data.productCode,
        Precio: data.price,
        "Envio?": data.delivery,
        Cantidad: data.productAmount,
        Nombre: data.name,
        Apellido: data.lastname,
        Direccion: data.direction,
        Ciudad: data.city,
        Numero: data.clientNumber,
        Observaciones: data.observation,
        Estatus: data.status,
      });
      return order;
    } catch (error) {
      throw error;
    }
  }

  // Guardar pedido
  async saveOrderPrint3D(data) {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[4];
    console.log(sheet.title);
    try {
      const order = await sheet.addRow({
        Fecha: data.date,
        Pedido: data.customerCode,
        Nombre: data.name,
        Apellido: data.lastname,
        Telefono: data.clientNumber,
        Cantidad: data.productAmount,
        'Tipo Pieza': data.namePrint,
        Descripcion : data.description,
        Proceso: data.status,
      });
      return order;
    } catch (error) {
      throw error;
    }
  }
}



module.exports = GoogleSheetService;
