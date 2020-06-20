const mongoose = require('mongoose');
const { Schema }= mongoose; 



const CompraSchema = new Schema({
    productoComprado: {type: String, required: true},
    seleccionProveedor: {type: String, required: true},
    cantidadComprada: {type: Number, required: true},
    costo: {type: Number, required: true},
    fechaDeCompra: { type: Date, required: true},
    descripcionCompra: { type: String, required: false},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})


module.exports = mongoose.model('Compra', CompraSchema)