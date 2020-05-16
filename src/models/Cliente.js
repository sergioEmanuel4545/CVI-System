const mongoose = require('mongoose');
const { Schema }= mongoose; 



const ClienteSchema = new Schema({
    nombre: {type: String, required: true},
    ci: {type: String, required: true},
    empresaOrganizacion: {type: String, required: true},
    nit: {type: String, required: true},
    telefono: {type: String, required: true},
    direccion: {type: String, required: true},
    descripcionCliente: { type: String, required: false},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})


module.exports = mongoose.model('Cliente', ClienteSchema)