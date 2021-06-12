const mongoose = require("mongoose");
const { Schema } = mongoose;

const VentaSchema = new Schema({
  productoVendido: {
    type: String,
    required: true,
  },
  seleccionCliente: {
    type: String,
    required: true,
  },
  cantidadVendida: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  fechaDeVenta: {
    type: String,
    required: true,
  },
  alContado: {
    type: Boolean,
    default: false,
  },
  saldo: { type: Number, required: false },
  montoPagado: { type: Number, required: false },
  Saldo: { type: Number, required: false },
  fechaDelSigCobro: { type: String, required: false },
  descripcionVenta: { type: String, required: false },
  date: { type: Date, default: Date.now },
  /* user: {type: String} */
});

module.exports = mongoose.model("Venta", VentaSchema);
