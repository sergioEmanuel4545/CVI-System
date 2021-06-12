const mongoose = require("mongoose");
const { Schema } = mongoose;

const CompraSchema = new Schema({
  productoComprado: { type: String, required: true },
  seleccionProveedor: { type: String, required: true },
  cantidadComprada: { type: Number, required: true },
  costo: { type: Number, required: true },
  alContado: {
    type: Boolean,
    default: false,
  },
  saldo: { type: Number, required: false },
  montoPagadoCompra: { type: Number, required: false },
  Saldo: { type: Number, required: false },
  fechaDelSigPago: { type: Date, required: false },
  fechaDeCompra: { type: String, required: true },
  descripcionCompra: { type: String, required: false },
  date: { type: Date, default: Date.now },
  /* user: {type: String} */
});

module.exports = mongoose.model("Compra", CompraSchema);
