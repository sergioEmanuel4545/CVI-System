const mongoose = require('mongoose');
const { Schema }= mongoose; 



const MoPoSchema = new Schema({
    nombreMoPo: {type: String, required: true},
    seleccionCategoria: {type: String,required:true},
    descripcionMoPo: { type: String, required: false},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})


module.exports = mongoose.model('MoPo', MoPoSchema)