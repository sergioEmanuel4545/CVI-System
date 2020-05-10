// urls pra que el usuario puedar crear o midificasr una nueva nota
const express = require('express');
const router = express.Router();


const Proveedor = require('../models/Proveedor');


/* const { isAuthenticated } = require('../helpers/auth'); */


router.get('/proveedores/add', /* isAuthenticated, */ (req,res) =>{
    res.render('Compras/addProveedores');
});



router.post('/proveedores/add', /* isAuthenticated,*/ async (req, res) => {
    const {nombre, nit, contacto, direccion, descripcion}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     if(!nombre){
        errors.push({text: 'Porfavor Introduzca nombre proveedor'});
     }
     if(!nit){
         errors.push({text: 'Porfavor Introduzca el nit'});
     }
     if(!contacto){
        errors.push({text: 'Porfavor Introduzca persona de contacto'});
    }
    if(!direccion){
        errors.push({text: 'Porfavor Introduzca la direccion'});
    }
    if(!descripcion){
        errors.push({text: 'Porfavor Introduzca una descripcion'});
    }
     if(errors.length > 0){
         res.render('Compras/addProveedores', {
            errors,
            nombre,
            nit,
            contacto,
            direccion,
            descripcion});
     }
     else{
         const nuevoProveedor =  new Proveedor({ nombre,nit,contacto,direccion,descripcion});
        /* nuevoProveedor.user = req.user.id; */
         await nuevoProveedor.save(); 
         req.flash('success_msg', 'Proveedor añadido correctamente');
        res.redirect('/proveedores'); 
     }  
 });


 router.get('/proveedores', /* isAuthenticated, */ async (req,res) =>{ 
    const listaProveedores = await (await Proveedor.find().lean());/* {user: req.user.id}  .sort({date: 'desc'}) */;
   
    res.render('Compras/proveedores', { listaProveedores });
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