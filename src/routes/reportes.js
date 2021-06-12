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
