const mongoose = require('mongoose');
const { Schema }= mongoose; 



const VentaSchema = new Schema({
    productoVendido: {type: String, required: true},
    seleccionCliente: {type: String, required: true},
    cantidadVendida: {type: String, required: true},
    precio: {type: String, required: true},
    fechaDeVenta: { type: Date, required: true},
    descripcionVenta: { type: String, required: false},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})


module.exports = mongoose.model('Venta', VentaSchema)