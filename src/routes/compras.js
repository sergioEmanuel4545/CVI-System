const express = require('express');
const router = express.Router();


const Proveedor = require('../models/Proveedor');
const Compra = require('../models/Compra');
const { isAuthenticated } = require('../helpers/auth');


router.get('/proveedores/add', isAuthenticated, (req,res) =>{
    res.render('Compras/addProveedores');
});
router.post('/proveedores/add', isAuthenticated, async (req, res) => {
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



 router.get('/proveedores', isAuthenticated, async (req,res) =>{ 
    const listaProveedores = await (await Proveedor.find().lean());/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    res.render('Compras/proveedores', { listaProveedores });
});


router.get('/proveedores/edit/:id', isAuthenticated, async (req,res) =>{
    const proveedor = await Proveedor.findById(req.params.id).lean();
    res.render('Compras/editProveedores', { proveedor });
});
router.put('/proveedores/editProveedor/:id', isAuthenticated, async (req, res) => {
    const {contacto,direccion, descripcion} = req.body;
    await Proveedor.findByIdAndUpdate(req.params.id, {contacto,direccion, descripcion});
    req.flash('success_msg', 'Proveedor actualizado correctamente');
    res.redirect('/proveedores');
   }); 





 







router.get('/compras/add', isAuthenticated, async (req,res) =>{ 
    const listaProveedores = await (await Proveedor.find().lean());/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    res.render('Compras/addCompras', { listaProveedores });
});
router.post('/compras/add', isAuthenticated, async (req, res) => {
    const {productoComprado, seleccionProveedor, cantidadComprada, costo, fechaDeCompra, descripcionCompra}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     const listaProveedores = await (await Proveedor.find().lean());
     if(!productoComprado){
        errors.push({text: 'Porfavor Introduzca el producto comprado'});
     }
     if(seleccionProveedor == '...'){
         errors.push({text: 'Porfavor seleccione proveedor'});
     }
     if(!cantidadComprada){
        errors.push({text: 'Porfavor Introduzca cantidad comprada'});
    }
    if(!costo){
        errors.push({text: 'Porfavor Introduzca el costo'});
    }
    if(!fechaDeCompra){
        errors.push({text: 'Porfavor Introduzca fecha de compra'});
    }
     if(errors.length > 0){
         res.render('Compras/addCompras', {
            errors,
            productoComprado,
            cantidadComprada,
            costo,
            listaProveedores,
            fechaDeCompra,
            descripcionCompra});
     }
     else{
         const nuevaCompra =  new Compra({ productoComprado,seleccionProveedor,cantidadComprada,costo,fechaDeCompra,descripcionCompra});
        /* nuevoProveedor.user = req.user.id; */
         await nuevaCompra.save(); 
         req.flash('success_msg', 'Compra Registrada correctamente');
        res.redirect('/compras'); 
     }  
 });
 router.get('/compras', isAuthenticated, async (req,res) =>{ 
    const listaCompras = await (await Compra.find().lean());/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    res.render('Compras/compras', { listaCompras });
});


router.get('/compras/edit/:id', isAuthenticated, async (req,res) =>{
    const compra = await Compra.findById(req.params.id).lean();
    res.render('Compras/editCompras', { compra });
});
router.put('/compras/editCompras/:id', isAuthenticated, async (req, res) => {
    const {descripcionCompra} = req.body;
    await Compra.findByIdAndUpdate(req.params.id, {descripcionCompra});
    req.flash('success_msg', 'Informacion Adicional Añadida correctamente');
    res.redirect('/compras');
   }); 



/* router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
 await Note.findByIdAndDelete(req.params.id);
 req.flash('error_msg', 'Note deleted successfully');
 res.redirect('/notes');
}) */
module.exports = router;