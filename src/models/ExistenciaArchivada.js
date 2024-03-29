const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExistenciaArchivadaSchema = new Schema({
  /* ingresoCategoria: {type: String, required: true}, */
  ingresoMoPo: { type: String, required: false },
  ingresoProducto: { type: String, required: false },
  ingresoCantidad: { type: Number, required: true },
  CodeLoteId: { type: String, required: true },
  fechaDeIngreso: { type: String, default: new Date().toISOString().substring(0, 16)},
  fechaVencimientoIngreso: { type: String, required: true },
  descripcionIngreso: { type: String, required: false },
  date: { type: Date, default: Date.now },
  /* user: {type: String} */
});

module.exports = mongoose.model(
  "ExistenciaArchivada",
  ExistenciaArchivadaSchema
);
