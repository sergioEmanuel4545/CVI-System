// urls pra que el usuario puedar crear o midificasr una nueva nota
const express = require('express');
const router = express.Router();
const newNote = 0;

//requerimos el modelos de datos de MONGODB para poder guardar un dato en la BD
/* const Note = require('../models/Note'); */
//aqui para poder ingresar a la carpeta se tiene que subir un nivel('../)

/* const { isAuthenticated } = require('../helpers/auth'); */







//crear una ruta que le permita al usu ver un formulario
router.get('/notes/add', /* isAuthenticated, */ (req,res) =>{
    res.render('notes/new-note');
     //tenemos que crear un formulario(vista) en notes
});


//toda este procedimiento es par guardar los datos que el usuario me envia a la base de datos
//creamos una ruta especifica para recibir datos, que envia un formulario
//peticion tipo POST voya recibirlo a una ruta especifica , el post tiene que estar indicado como un metodo en donde envie el formulario
/* router.post('/notes/new-notes', isAuthenticated, async (req, res) => {
    //observamos que es un objeto deJS xq tiene llaves y adentro tiene propiedades, cada uno de los datos que envia el usuario es una propiedad
    //DESCTRUCTURING, poder sacar cada propiedad por separado en una constante o variable a partir de un objeto
    const {title, description}= req.body;
    //quiero destructurar el title y el descrption, puden estar almacenados dentro una variable o constante, en este caso sera constante 
    //PROCESO DE VALIDACION
    const errors = [];
    //creamos la constante errors como un arreglo
    if(!title){
        //si en lo que me envia el usuario esta vacio
        errors.push({text: 'Please write a title'});
        //insertamos en la const errors, un objeto que tendra como propiedad text: que tendra como valor:..
    }
    if(!description){
        //si usuario no envia description o si este se encuentra vacio
        errors.push({text: 'please write a description' });
    }
    if(errors.length > 0){
        //si el arreglo errors contine errores
        res.render('notes/new-note', {
            //renderizamos nuevamente la vista de la insercion de los formularios, xq ahora la vista tambien mostrara unos mesajes con los errores econtrados
            errors,
            //aqui mandamos los errores
            title,
            description});
    }
    else{
        //res.send('ok');//response para ver algo y no se quede procesando y mandamos un ok como simulando que se inserto algun dato en la base de datos
        const newNote =  new Note({ title, description });
        newNote.user = req.user.id;
        //aqui instanciamos la clase y le pasamos los datos, se crea nuevos datos para gurardar en mongo db
        await newNote.save(); 
        req.flash('success_msg', 'Note added successfully');
        //para REALMENTE guardar en DB tenemos qy ejeutar un metodo llamdo save
        //guardar en DB es un proceso asincrono, puesto que no sabemos cuento tiempo puede tardar hasta que termine el proceso de guardado, por lo que tenemos que declararlo en NODE.JS como AWAIT y en el metodo colocar "async" para que habilite la opcion de poner "await"
        //await= todo lo que esta debajo de await, se indica que espere para que termine la line adel await  
        res.redirect('/notes');
        //despues que acabae el proceso de await voy a redireccionar a una vista, dandole una ruta
    }    //req=request body es una propiead de la misma funcion para que reciba los datos, cuadno hagamos click en enviar asdicion
    });
 //la logica:cuando visites es ta ruta, que consulte a la base de datos y le pasamos la vista con las notas de la base de datos 
    router.get('/notes', isAuthenticated, async (req,res) =>{ 
        //aqui se crea la vista y el procedimiento a seguir
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'})
    //jalamos los datos de la DB, dentro de find no le especificamos nada xq queremos que nos dvuelva todo, como no sabemos(igual que el guardado cuento pude tardar, entonces lo declaramos como asyncrono)
    //y lo almacenamos en una constante
    //ponemos .sort() para que organize los datos que encuentra en la base de datos, por la fecha de creacion de manera descendente
    res.render('notes/all-notes', { notes });
}); */

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