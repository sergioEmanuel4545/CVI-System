const express = require('express');
const router = express.Router();
const newNote = 0;

//requerimos el modelos de datos de MONGODB para poder guardar un dato en la BD
const Note = require('../models/Note');
//aqui para poder ingresar a la carpeta se tiene que subir un nivel('../)

/* const { isAuthenticated } = require('../helpers/auth'); */








router.get('/notes/add', /* isAuthenticated, */ (req,res) =>{
    res.render('notes/new-note');
     //tenemos que crear un formulario(vista) en notes
});



router.post('/blabla/sergio1', /* isAuthenticated, */ async (req, res) => {
   const {title, description}= req.body;
    //quiero destructurar el title y el descrption, puden estar almacenados dentro una variable o constante, en este caso sera constante 
    //PROCESO DE VALIDACION
    const errors = [];
    if(!title){
        errors.push({text: 'Please write a title'});
   }
    if(!description){
      errors.push({text: 'please write a description' });
    }
    if(errors.length > 0){
       res.render('notes/new-note', {
            errors,
            title,
            description});
    }
    else{
        //res.send('ok');//response para ver algo y no se quede procesando y mandamos un ok como simulando que se inserto algun dato en la base de datos
        const newNote =  new Note({ title, description });
        /* newNote.user = req.user.id; */
        //aqui instanciamos la clase y le pasamos los datos, se crea nuevos datos para gurardar en mongo db
        await newNote.save(); 
        req.flash('success_msg', 'Note added successfully');
       res.redirect('/notes');
    }  
});



 //la logica:cuando visites es ta ruta, que consulte a la base de datos y le pasamos la vista con las notas de la base de datos 
    router.get('/notes', /* isAuthenticated, */ async (req,res) =>{ 
    const notes = await Note.find().lean();/* {user: req.user.id}  .sort({date: 'desc'}) */
    //jalamos los datos de la DB, dentro de find no le especificamos nada xq queremos que nos dvuelva todo, como no sabemos(igual que el guardado cuento pude tardar, entonces lo declaramos como asyncrono)
    //y lo almacenamos en una constante
    //ponemos .sort() para que organize los datos que encuentra en la base de datos, por la fecha de creacion de manera descendente
    res.render('notes/all-notes', { notes });
   
});

/* router.get('/notes/edit/:id', isAuthenticated, async (req,res) =>{
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
}); */

/* router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
 const {title, description} = req.body;
 await Note.findByIdAndUpdate(req.params.id, {title, description});
 req.flash('success_msg', 'Note updated successfully');
 res.redirect('/notes');
}); */

/* router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
 await Note.findByIdAndDelete(req.params.id);
 req.flash('error_msg', 'Note deleted successfully');
 res.redirect('/notes');
}) */
module.exports = router;