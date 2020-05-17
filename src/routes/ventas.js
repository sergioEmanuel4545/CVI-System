const express = require('express');
const router = express.Router();


const Cliente = require('../models/Cliente');
const Venta = require('../models/Venta');
const { isAuthenticated } = require('../helpers/auth');


router.get('/clientes/add', isAuthenticated, (req,res) =>{
    res.render('Ventas/addClientes');
});
router.post('/clientes/add', isAuthenticated, async (req, res) => {
    const {nombre,ci,empresaOrganizacion, nit, telefono, direccion, descripcionCliente}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     if(!nombre){
        errors.push({text: 'Porfavor Introduzca nombre cliente'});
     }
     if(!ci){
        errors.push({text: 'Porfavor Introduzca la Cedula de Identidad'});
    }
    if(!empresaOrganizacion){
        errors.push({text: 'Porfavor Introduzca Empresa u Organizacion'});
    }
     if(!nit){
         errors.push({text: 'Porfavor Introduzca el Nit'});
     }
     if(!telefono){
        errors.push({text: 'Porfavor Introduzca Números telefonicos'});
    }
    if(!direccion){
        errors.push({text: 'Porfavor Introduzca la direccion'});
    }
     if(errors.length > 0){
         res.render('Ventas/addClientes', {
            errors,
            nombre,
            ci,
            empresaOrganizacion,
            nit,
            telefono,
            direccion,
            descripcionCliente});
     }
     else{
         const nuevoCliente =  new Cliente({ nombre,ci,empresaOrganizacion,nit,telefono,direccion,descripcionCliente});
        /* nuevoProveedor.user = req.user.id; */
         await nuevoCliente.save(); 
         req.flash('success_msg', 'Cliente añadido correctamente');
        res.redirect('/clientes'); 
     }  
 });



 router.get('/clientes', isAuthenticated, async (req,res) =>{ 
    const listaClientes = await (await Cliente.find().lean());/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    for (i=0; i<listaClientes.length;i++){
        /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
        listaClientes[i].contador = i+1;
    }
    res.render('Ventas/clientes', { listaClientes });
});


router.get('/clientes/edit/:id', isAuthenticated, async (req,res) =>{
    const cliente = await Cliente.findById(req.params.id).lean();
    res.render('Ventas/editClientes', { cliente });
});
router.put('/clientes/editCliente/:id', isAuthenticated, async (req, res) => {
    const {telefono,direccion, descripcionCliente} = req.body;
    await Cliente.findByIdAndUpdate(req.params.id, {telefono,direccion, descripcionCliente});
    req.flash('success_msg', 'Cliente actualizado correctamente');
    res.redirect('/clientes');
   }); 





 







router.get('/ventas/add', isAuthenticated, async (req,res) =>{ 
    const listaClientes = await (await Cliente.find().lean());/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    res.render('Ventas/addVentas', { listaClientes });
});
router.post('/ventas/add', isAuthenticated, async (req, res) => {
    const {productoVendido, seleccionCliente, cantidadVendida, precio, fechaDeVenta, descripcionVenta}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     const listaClientes = await (await Cliente.find().lean());
     if(!productoVendido){
        errors.push({text: 'Porfavor Introduzca el producto vendido'});
     }
     if(seleccionCliente == '...'){
         errors.push({text: 'Porfavor seleccione cliente'});
     }
     if(!cantidadVendida){
        errors.push({text: 'Porfavor Introduzca cantidad vendida'});
    }
    if(!precio){
        errors.push({text: 'Porfavor Introduzca el precio de venta'});
    }
    if(!fechaDeVenta){
        errors.push({text: 'Porfavor Introduzca fecha de venta'});
    }
     if(errors.length > 0){
         res.render('Ventas/addVentas', {
            errors,
            productoVendido,
            listaClientes,
            cantidadVendida,
            precio,
            fechaDeVenta,
            descripcionVenta});
     }
     else{
         const nuevaVenta =  new Venta({productoVendido, seleccionCliente, cantidadVendida, precio, fechaDeVenta, descripcionVenta});
        /* nuevoProveedor.user = req.user.id; */
         await nuevaVenta.save(); 
         req.flash('success_msg', 'Venta Registrada correctamente');
        res.redirect('/ventas'); 
     }  
 });
 router.get('/ventas', isAuthenticated, async (req,res) =>{ 
    const listaVentas = await (await Venta.find().lean());/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    for (i=0; i<listaVentas.length;i++){
        /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
        listaVentas[i].contador = i+1;
    }
    res.render('Ventas/ventas', { listaVentas });
});


router.get('/ventas/edit/:id', isAuthenticated, async (req,res) =>{
    const venta = await Venta.findById(req.params.id).lean();
    res.render('Ventas/editVentas', { venta });
});
router.put('/ventas/editVentas/:id', isAuthenticated, async (req, res) => {
    const {descripcionVenta} = req.body;
    await Venta.findByIdAndUpdate(req.params.id, {descripcionVenta});
    req.flash('success_msg', 'Informacion Adicional Añadida correctamente');
    res.redirect('/ventas');
   }); 



/* router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
 await Note.findByIdAndDelete(req.params.id);
 req.flash('error_msg', 'Note deleted successfully');
 res.redirect('/notes');
}) */
module.exports = router;