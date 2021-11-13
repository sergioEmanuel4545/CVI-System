const express = require("express");
const router = express.Router();

const Proveedor = require("../models/Proveedor");
const Compra = require("../models/Compra");
const Cliente = require("../models/Cliente");
const Venta = require("../models/Venta");
const { isAuthenticated } = require("../helpers/auth");

router.get("/reportes/compras", isAuthenticated, async (req, res) => {
  let countProveedor = await Proveedor.countDocuments();
  let countCompra = await Compra.countDocuments();
  let countAcreedores = await Compra.find({
    saldo: { $ne: 0 },
  }).countDocuments();

  res.render("Reportes/repCompra", {
    countProveedor,
    countCompra,
    countAcreedores,
  });
});

router.get("/reportes/ventas", isAuthenticated, async (req, res) => {
  let countCliente = await Cliente.countDocuments();
  let countVenta = await Venta.countDocuments();
  let countDeudores = await Venta.find({ saldo: { $ne: 0 } }).countDocuments();

  res.render("Reportes/repVenta", {
    countCliente,
    countVenta,
    countDeudores,
  });
});

router.post("/reportes/compras/calendar", isAuthenticated, async (req, res) => {
  const {
    fechaInicioRepCompra,
    fechaFinalRepCompra,
    /* ingresoCantidad,
    CodeLoteId,
    fechaVencimientoIngreso,
    descripcionIngreso, */
  } = req.body;
  const errors = [];
  //PROCESO DE VALIDACION
  /* const cantidadDeInicio = ingresoCantidad;
 
  const LoteIDDup = await Existencia.findOne({ CodeLoteId: CodeLoteId }); */
  /* await Existencia.update({CodeLoteId: CodeLoteId},{$set:{cantidadDeIngreso:ingresoCantidad}}); */

  /* let listaExistencias = await Existencia.find().lean();
  const listaMoPos = await MoPo.find().lean();
  const listaProductos = await Producto.find().lean(); */

  /* const CEx =
    100001 +
    (await Existencia.countDocuments()) +
    (await ExistenciaArchivada.countDocuments());
  const CLID = "L" + CEx;
  for (i = 0; i < listaExistencias.length; i++) {
    listaExistencias[i].contador = i + 1;
  } */
  /* if (ingresoMoPo == "...") {
    if (ingresoProducto == "...") {
      errors.push({ text: "ERROR: Porfavor elija elemento a ingresar" });
    }
  }
  if (ingresoMoPo != "...") {
    if (ingresoProducto != "...") {
      errors.push({
        text: "ERROR: Solo se puede elegir una clase de elemento",
      });
    }
  }
  if (!ingresoCantidad) {
    errors.push({ text: "ERROR: Porfavor Introduzca Cantidad del Elemento" });
  }
  if (ingresoCantidad <= 0) {
    errors.push({ text: "ERROR: Porfavor Introduzca una cantidad Mayor a 0" });
  }
  if (!CodeLoteId) {
    errors.push({
      text: "ERROR: Lote_ID vacio, contactese con el administrador",
    });
  }
  if (LoteIDDup) {
    errors.push({
      text: "ERROR: El Lote_ID ya existe, contactese con el administrador",
    });
  } */
  if (!fechaInicioRepCompra) {
    errors.push({
      text: "ERROR: Por Favor introduzca fecha de Inicio de Reporte",
    });
  }
  if (!fechaFinalRepCompra) {
    errors.push({ text: "ERROR: Por Favor introduzca fecha Final de Reporte" });
  }
  /* if (fechaInicioRepCompra) {
    errors.push({
      text: "ERROR: Por Favor introduzca fecha de Inicio de Reporte",
    });
  } */
  if (errors.length > 0) {
    res.render("Reportes/repCompra", {
      errors,
      fechaInicioRepCompra,
      fechaFinalRepCompra,
    });
  } else {
    /*  const nuevaExistencia = new Existencia({
      ingresoMoPo,
      ingresoProducto,
      ingresoCantidad,
      cantidadDeInicio,
      CodeLoteId,
      fechaVencimientoIngreso,
      descripcionIngreso,
    });
    // nuevoProveedor.user = req.user.id; 
    await nuevaExistencia.save(); */
    console.log(fechaInicioRepCompra, fechaFinalRepCompra);
    req.flash("success_msg", "Nuevo Rango de Fechas ");
    res.redirect("/reportes/compras");
  }
});
/* router.get("/existencias/edit/:id", isAuthenticated, async (req, res) => {
  const existencia = await Existencia.findById(req.params.id).lean();

  res.render("Inventarios/editExistencias", { existencia });
}); */

/* router.get("/reportes", isAuthenticated, async (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    let listaExistenciasArchivadas = await ExistenciaArchivada.find({
      $or: [
        { ingresoMoPo: regex },
        { ingresoProducto: regex },
        { CodeLoteId: regex },
        { descripcionIngreso: regex },
      ],
    }).lean();
    for (i = 0; i < listaExistenciasArchivadas.length; i++) {
      listaExistenciasArchivadas[i].contador = i + 1;
    }
    res.render("Reportes/repCompraVenta", { listaExistenciasArchivadas });
  } else {
    let listaExistenciasArchivadas = await ExistenciaArchivada.find().lean();
    for (i = 0; i < listaExistenciasArchivadas.length; i++) {
      listaExistenciasArchivadas[i].contador = i + 1;
    }
    res.render("Reportes/repCompraVenta", { listaExistenciasArchivadas });
  }
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
} */

module.exports = router;
