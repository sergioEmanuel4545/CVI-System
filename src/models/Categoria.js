const mongoose = require('mongoose');
const { Schema }= mongoose; 



const CategoriaSchema = new Schema({
    nombreCategoria: {type: String, required: true},
    descripcionCategoria: { type: String, required: false},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})


module.exports = mongoose.model('Categoria', CategoriaSchema)