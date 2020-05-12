//utilizamos mongoose ya que sirve para CREAR SCHEMAS DE DATOS
const mongoose = require('mongoose');
const { Schema }= mongoose; 
// de mongoose solo nos importa el esquema y lo guardamos en una constante


//describimos que propiedades van atener
const NoteSchema = new Schema({
    title: {type: String, required: true},
    //TRUE no puede estar vacio
    description: { type: String, required: true},
    date: {type: Date, default: Date.now}
    /* user: {type: String} */
})

//hay que decir a mongo db como crear el modelo
//module.export para utizar este modelo de datos en otras partes de la aplicacion
//al utilizar model tenenmo que podner 2 parametros la nota y el esquema
module.exports = mongoose.model('Note', NoteSchema)