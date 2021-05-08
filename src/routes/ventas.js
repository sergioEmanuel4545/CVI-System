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
     const nombreDup = await Cliente.findOne({nombre: nombre});
     const ciDup = await Cliente.findOne({ci:ci});
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
    if(nombreDup){
        errors.push({text: 'Cliente ya existe'})
    }
    if(ciDup){
        errors.push({text: 'El C.I. ya existe'})
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
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const listaClientes = await Cliente.find({$or:[{nombre:regex},{ci:regex},{empresaOrganizacion:regex},{nit:regex},{descripcionCliente:regex}]}).lean(); 
        for (i=0; i<listaClientes.length;i++){
         listaClientes[i].contador = i+1;
        }
        res.render('Ventas/clientes', { listaClientes });
       }
       else{
           const listaClientes = await Cliente.find().lean();/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
       for (i=0; i<listaClientes.length;i++){
           /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
           listaClientes[i].contador = i+1;
       }
       res.render('Ventas/clientes', { listaClientes });
    }
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
    const listaClientes = await Cliente.find().lean();/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
    res.render('Ventas/addVentas', { listaClientes });
});
router.post('/ventas/add', isAuthenticated, async (req, res) => {
    let {productoVendido, seleccionCliente, cantidadVendida, precio, fechaDeVenta,alContado,montoPagado,fechaDelSigCobro, descripcionVenta}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     const listaClientes = await Cliente.find().lean();
     var saldo = precio - montoPagado;
     if(alContado){
         saldo = 0;
     }
     if(precio == saldo){
        montoPagado = 0;
     }
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
    if(montoPagado < 0){
        errors.push({text: 'No se permiten valores negativos'});
    }
    if (!alContado){//¿Xq no sirve alContado != true??? probamos y no cumple
        if(montoPagado > precio){//¿Xq no sirve montoPagado > precio no cumple la condicion ni la logica!
            errors.push({text: 'El monto pagado es mayor o igual que el precio'});
        }
    }    
    if(!fechaDelSigCobro && !alContado){
        errors.push({text: 'Favor ingresar fecha del siguiente cobro'});
    }
     if(errors.length > 0){
         res.render('Ventas/addVentas', {
            errors,
            productoVendido,
            listaClientes,
            cantidadVendida,
            montoPagado,
            fechaDelSigCobro,
            precio,
            fechaDeVenta,
            descripcionVenta});
             }
     else{
         const nuevaVenta =  new Venta({productoVendido, seleccionCliente, cantidadVendida, precio, fechaDeVenta,alContado,montoPagado,fechaDelSigCobro,saldo, descripcionVenta});
        /* nuevoProveedor.user = req.user.id; */
         await nuevaVenta.save(); 
         req.flash('success_msg', 'Venta Registrada correctamente');
        res.redirect('/ventas'); 
     }  
 });
 router.get('/ventas', isAuthenticated, async (req,res) =>{ 
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const listaVentas = await (await Venta.find({$or:[{productoVendido:regex},{seleccionCliente:regex},{descripcionVenta:regex}]}).lean());
        for (i=0; i<listaVentas.length;i++){
        listaVentas[i].contador = i+1;}
        res.render('Ventas/ventas', { listaVentas });
    }
       else{
        const listaVentas = await (await Venta.find().lean());/* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
        for (i=0; i<listaVentas.length;i++){
            /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
            listaVentas[i].contador = i+1;
        }
        res.render('Ventas/ventas', { listaVentas });
        }
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





/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////   Seguimiento de deudas de los clientes  //////////////////////////////////


router.get('/ventas/seguimiento', isAuthenticated, async (req,res) =>{ 
 if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const listaDeudores = await Venta.find({$or:[{saldo:{$ne: 0},seleccionCliente:regex},{saldo:{$ne: 0},productoVendido:regex},{saldo:{$ne: 0},descripcionVenta:regex}]}).lean();
      for (i=0; i<listaDeudores.length;i++){
        listaDeudores[i].contador = i+1;
        } 
        res.render('Ventas/seguimientoDeudas', { listaDeudores });
  }
  else{
     const listaDeudores = await Venta.find({saldo:{$ne: 0}}).lean();
      for (i=0; i<listaDeudores.length;i++){
    /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
        listaDeudores[i].contador = i+1;
        }   
    /* {user: req.user.id}    .sort({date: 'desc'}) para que lo ultimo que ingresaste te aparezca primero*/
        res.render('Ventas/seguimientoDeudas', { listaDeudores });
  }
});



router.get('/ventas/cobrodeudas/:id', isAuthenticated, async (req,res) =>{
    const venta = await Venta.findById(req.params.id).lean();
    res.render('Ventas/cobroDeudas', { venta });
});

router.put('/ventas/cobrodeuda/:id', isAuthenticated, async (req, res) => {
    const listaDeudores = await Venta.find({saldo:{$ne: 0}}).lean();
    for (i=0; i<listaDeudores.length;i++){
        /* listaProveedores[i] ={...listaProveedores[i], contador:"hola"};  cualquiera de las dos sintaxis se puede utilizar*/
        listaDeudores[i].contador = i+1;
    }   
    const {montoCobrado,fechaDelSigCobro,descripcionVenta} = req.body;
    const venta = await Venta.findById(req.params.id).lean();
   const suma = parseInt(venta.montoPagado,10) + parseInt(montoCobrado,10);
   const errors = [];
   if(!montoCobrado){
    errors.push({text: 'Porfavor Introduzca el monto cobrado.'});
    }
    if(!fechaDelSigCobro){
        errors.push({text: 'Favor ingresar fecha del siguiente cobro. Si el saldo fue pagado completamente, elegir cualquier fecha.'})
    }
    if(montoCobrado < 0){
        errors.push({text: 'ERROR: No se permiten números negativos.'})
    }
    if(montoCobrado > venta.saldo){
        errors.push({text: 'ERROR: El monto cobrado es mayor de que saldo.'})
    }
    if(errors.length > 0){
     res.render('Ventas/seguimientoDeudas', {
        errors,
        listaDeudores});
     }
 else{
     if (venta.precio == suma){
    venta.saldo = 0;
    venta.fechaDelSigCobro = "";
    }else{
        venta.saldo = venta.precio - suma;
        venta.fechaDelSigCobro = fechaDelSigCobro;
    }await Venta.findByIdAndUpdate(req.params.id,{
        montoPagado: suma,
        saldo: venta.saldo,
        fechaDelSigCobro: venta.fechaDelSigCobro,
        descripcionVenta: descripcionVenta});
    req.flash('success_msg', 'Cobro realizado correctamente');
    res.redirect('/ventas/seguimiento');
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
//module.exports = Venta;