const mongoose = require('mongoose');
const { Schema }= mongoose; 



const ProveedorSchema = new Schema({
    nombre: {type: String, required: true},
    nit: {type: String, required: true},
    contacto: {type: String, required: true},
    direccion: {type: String, required: true},
    descripcion: { type: String, required: true},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})


module.exports = mongoose.model('Proveedor', ProveedorSchema)