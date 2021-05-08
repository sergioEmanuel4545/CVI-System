const express = require('express');
const router = express.Router();
const newNote = 0;

//requerimos el modelos de datos de MONGODB para poder guardar un dato en la BD
const Note = require('../models/Note');
//aqui para poder ingresar a la carpeta se tiene que subir un nivel('../)

const { isAuthenticated } = require('../helpers/auth');








router.get('/notes/add',  isAuthenticated,  (req,res) =>{
    res.render('notes/new-note');
     //tenemos que crear un formulario(vista) en notes
});



router.post('/blabla/sergio1', isAuthenticated, async (req, res) => {
   const {title, description}= req.body;
    //PROCESO DE VALIDACION
    const errors = [];
    if(!title){
        errors.push({text: 'Por favor escribe un título'});
   }
    if(!description){
      errors.push({text: 'Por favor escribe una descripción' });
    }
    if(errors.length > 0){
       res.render('notes/new-note', {
            errors,
            title,
            description});
    }
    else{
        const newNote =  new Note({ title, description });
        newNote.user = req.user.id; 
//codigo especial para consultar solo las notas que pernetecen a un Usuario
        await newNote.save();        
        req.flash('success_msg', 'Nota/Tarea creada correctamente');
        res.redirect('/notes');
    }  
});



   router.get('/notes', isAuthenticated, async (req,res) =>{ 
       if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const notes = await Note.find({$or:[{user: req.user.id,title: regex},{user: req.user.id,description: regex}]}).sort({date: 'desc'}).lean();  
      res.render('notes/all-notes', { notes });
       }
       else{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}).lean();  
//codigo especial para consultar solo las notas que pernetecen a un Usuario
      res.render('notes/all-notes', { notes });
    }
});

router.get('/notes/edit/:id', isAuthenticated, async (req,res) =>{
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
}); 

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
 const {title, description} = req.body;
 await Note.findByIdAndUpdate(req.params.id, {title, description});
 req.flash('success_msg', 'Nota/Tarea actualizada correctamente');
 res.redirect('/notes');
}); 

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
 await Note.findByIdAndDelete(req.params.id);
 req.flash('error_msg', 'Nota/Tarea Borrada correctamente');
 res.redirect('/notes');
}) 


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;