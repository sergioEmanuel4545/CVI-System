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
     const nombreDup = await Proveedor.findOne({nombre: nombre});
     const nitDup = await Proveedor.findOne({nit:nit});
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
    if(nombreDup){
        errors.push({text: 'El Proveedor ya existe'})
    }
    if(nitDup){
        errors.push({text: 'El Nit ya existe'})
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
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        let listaProveedores = await Proveedor.find({$or:[{nombre:regex},{nit:regex},{contacto:regex},{descripcion:regex}]}).lean();
        for (i=0; i<listaProveedores.length;i++){
             listaProveedores[i].contador = i+1;
        }
        res.render('Compras/proveedores', { listaProveedores }); 
    }
    else{
    let listaProveedores = await Proveedor.find().lean();/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    for (i=0; i<listaProveedores.length;i++){
        /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"}; */
        listaProveedores[i].contador = i+1;
    }
    res.render('Compras/proveedores', { listaProveedores });
    } 
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
router.post('/compras/add', /* isAuthenticated, */ async (req, res) => {
    let {productoComprado, seleccionProveedor, cantidadComprada, costo, fechaDeCompra, alContado,montoPagadoCompra,fechaDelSigPago,descripcionCompra}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     const listaProveedores = await Proveedor.find().lean();
     var saldo = costo - montoPagadoCompra;
     if(alContado){
         saldo = 0;
     }
     if(costo == saldo){
        montoPagadoCompra = 0;
     }
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
    if(montoPagadoCompra < 0){
        errors.push({text: 'No se permiten valores negativos'});
    }
    if (!alContado){//¿Xq no sirve alContado != true??? probamos y no cumple => xq JS tiene otra logaica al momento de comparar booleanos
        if(montoPagadoCompra >> costo){//¿Xq no sirve montoPagado > precio no cumple la condicion ni la logica! => xq en JS si tiene otra sintaxis al momento de comparar dos numbers ">>" es el correcto indicador 
            errors.push({text: 'El monto pagado es mayor o igual que el costo'});
        }
    }    
    if(!fechaDelSigPago && !alContado){
        errors.push({text: 'Favor ingresar fecha del siguiente Pago'});
    }
     if(errors.length > 0){
         res.render('Compras/addCompras', {
            errors,
            productoComprado,
            cantidadComprada,
            costo,
            montoPagadoCompra,
            fechaDelSigPago,
            listaProveedores,
            fechaDeCompra,
            descripcionCompra});
     }
     else{
         const nuevaCompra =  new Compra({ productoComprado,seleccionProveedor,cantidadComprada,costo,saldo,alContado,fechaDelSigPago,montoPagadoCompra,fechaDeCompra,descripcionCompra});
        /* nuevoProveedor.user = req.user.id; */
         await nuevaCompra.save(); 
         req.flash('success_msg', 'Compra Registrada correctamente');
        res.redirect('/compras'); 
     }  
 });
 router.get('/compras', isAuthenticated, async (req,res) =>{ 
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        let listaCompras = await Compra.find({$or:[{productoComprado:regex},{seleccionProveedor:regex},{descripcionCompra:regex}]}).lean();
        for (i=0; i<listaCompras.length;i++){
             listaCompras[i].contador = i+1;
        }
        res.render('Compras/compras', { listaCompras });
    }
    else{
    const listaCompras = await Compra.find().lean();/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    for (i=0; i<listaCompras.length;i++){
        /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
        listaCompras[i].contador = i+1;
    }
    res.render('Compras/compras', { listaCompras });
    }
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





/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////   Control de Prestamos a los Proveedores  //////////////////////////////////


router.get('/compras/controlPrestamos', isAuthenticated, async (req,res) =>{ 
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        let listaAcreedores = await Compra.find({$or:[{saldo:{$ne: 0},productoComprado:regex},{saldo:{$ne: 0},seleccionProveedor:regex},{saldo:{$ne: 0},descripcionCompra:regex}]}).lean();
        for (i=0; i<listaAcreedores.length;i++){
            listaAcreedores[i].contador = i+1;;
        }
        res.render('Compras/controlPrestamos', { listaAcreedores });
    }
    else{
    const listaAcreedores = await Compra.find({saldo:{$ne: 0}}).lean();
    for (i=0; i<listaAcreedores.length;i++){
        /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
        listaAcreedores[i].contador = i+1;
    }   
/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    res.render('Compras/controlPrestamos', { listaAcreedores });
    }
});



router.get('/compras/pagodeudas/:id', isAuthenticated, async (req,res) =>{
    const compra = await Compra.findById(req.params.id).lean();
    res.render('Compras/pagoPrestamos', { compra });
});

router.put('/compras/pagodeuda/:id', isAuthenticated, async (req, res) => {
    const listaAcreedores = await Compra.find({saldo:{$ne: 0}}).lean();
    for (i=0; i<listaAcreedores.length;i++){
        /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
        listaAcreedores[i].contador = i+1;
    }   
    const {montoPagado2,fechaDelSigPago,descripcionCompra} = req.body;
    const compra = await Compra.findById(req.params.id).lean();
   const suma = parseInt(compra.montoPagadoCompra,10) + parseInt(montoPagado2,10);
   const errors = [];
   if(!montoPagado2){
    errors.push({text: 'Porfavor Introduzca el monto a Pagar.'});
    }
    if(!fechaDelSigPago){
        errors.push({text: 'Favor ingresar fecha del siguiente Pago. Si el saldo fue pagado completamente, elegir cualquier fecha.'})
    }
    if(montoPagado2 < 0){
        errors.push({text: 'ERROR: No se permiten números negativos.'})
    }
    if(montoPagado2 > compra.saldo){
        errors.push({text: 'ERROR: El monto a pagar es mayor de que saldo.'})
    }
    if(errors.length > 0){
     res.render('Compras/controlPrestamos', {
        errors,
        listaAcreedores
        });
 }
 else{
     if (compra.costo == suma){
    compra.saldo = 0;
    compra.fechaDelSigPago = "";
    }else{
        compra.saldo = compra.costo - suma;
        compra.fechaDelSigPago = fechaDelSigPago;
    }await Compra.findByIdAndUpdate(req.params.id,{
        montoPagadoCompra: suma,
        saldo: compra.saldo,
        fechaDelSigPago: compra.fechaDelSigPago,
        descripcionVenta: descripcionCompra});
    req.flash('success_msg', 'Pago realizado correctamente');
    res.redirect('/compras/controlPrestamos');
    }
}); 




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
/* router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
 await Note.findByIdAndDelete(req.params.id);
 req.flash('error_msg', 'Note deleted successfully');
 res.redirect('/notes');
}) */
module.exports = router;