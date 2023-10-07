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

  async showResultSorteo() {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[5];
      await sheet.loadCells();
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Sorteo activo?") === "Si")
        .map((row) => ({
          respuesta: row.get("Sorteo activo?"),
          sorteo: row.get("Que se sortea?"),
          Link: row.get("Link imagen"),
          Listado: row.get("Listado"),
          '1 puesto': row.get("1 puesto"),
          '2 puestos': row.get("2 puestos"),
          Puestos: row.get("2 puestos"),
          Ganadores: row.get("Total Ganadores"),
          Condiciones: row.get("Condiciones"),
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  async showResultRifa(targetCode) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[6];
      await sheet.loadCells();
      const rows = await sheet.getRows();

      const rowDataArray = rows
        .filter((row) => row.get("Numero de rifa") === targetCode)
        .map((row) => ({
          nombre: row.get("Numero de rifa"),
        }));

      const rowData = rowDataArray.length > 0 ? rowDataArray[0] : null;

      return rowData;
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
  async saveOrderRifa(data) {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[6];
    console.log(sheet.title);
    try {
      const order = await sheet.addRow({
        Dia: data.date,
        Hora: data.hour,
        Nombre: data.name,
        Apellido: data.lastname,
        Telefono:data.telefono,
        'Numero de rifa': data.numeroRifa,
        Estado: data.estado

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
