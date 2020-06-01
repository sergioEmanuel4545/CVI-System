const mongoose = require('mongoose');
const { Schema }= mongoose; 



const ProductoSchema = new Schema({
    nombreProducto: {type: String, required: true},
    seleccionCategoria: {type: String,required:true},
    descripcionProducto: { type: String, required: false},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})


module.exports = mongoose.model('Producto', ProductoSchema)