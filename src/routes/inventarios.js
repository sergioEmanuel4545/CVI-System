const express = require('express');
const router = express.Router();

const Categoria = require('../models/Categoria');
const MoPo = require('../models/MoPo');
const Producto = require('../models/Producto');
const Existencia = require('../models/Existencia');
const ExistenciaArchivada = require('../models/ExistenciaArchivada');
const { isAuthenticated } = require('../helpers/auth');




router.get('/inventarios/categorias', isAuthenticated, async (req,res) =>{ 
    let listaCategorias = await Categoria.find().lean();
    for (i=0; i<listaCategorias.length;i++){
        listaCategorias[i].contador = i+1;  }
   res.render('Inventarios/categorias', {listaCategorias}); 
});

router.post('/categorias/add', isAuthenticated, async (req, res) => {
    const {nombreCategoria, descripcionCategoria}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     const nombreDup = await Categoria.findOne({nombreCategoria: nombreCategoria});
     let listaCategorias = await Categoria.find().lean();
    for (i=0; i<listaCategorias.length;i++){
        listaCategorias[i].contador = i+1;
    }
     if(!nombreCategoria){
        errors.push({text: 'ERROR: Porfavor Introduzca nombre de Categoria'});
     }
     if(nombreDup){
        errors.push({text: 'ERROR: La Categoria ya existe'})
    }
     if(errors.length > 0){
         res.render('Inventarios/categorias', {
            errors,
            nombreCategoria,
            listaCategorias,
            descripcionCategoria});
     }
     else{
         const nuevaCategoria =  new Categoria({ nombreCategoria,descripcionCategoria});
        /* nuevoProveedor.user = req.user.id; */
         await nuevaCategoria.save(); 
         req.flash('success_msg', 'Categoria añadida correctamente');
        res.redirect('/inventarios/categorias'); 
     }  
 });

router.get('/categorias/edit/:id', isAuthenticated, async (req,res) =>{
    const categoria = await Categoria.findById(req.params.id).lean();
    res.render('Inventarios/editCategorias', { categoria });
});
router.put('/categorias/editCategoria/:id', isAuthenticated, async (req, res) => {
    const {nombreCategoria, descripcionCategoria} = req.body;
    await Categoria.findByIdAndUpdate(req.params.id, {nombreCategoria, descripcionCategoria});
    req.flash('success_msg', 'Categoria actualizada correctamente');
    res.redirect('/inventarios/categorias');
   }); 


/* |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/*                            MoPos                                                                    */
router.get('/inventarios/mopos', isAuthenticated, async (req,res) =>{ 
    const listaCategorias = await Categoria.find().lean();
    let listaMoPos = await MoPo.find().lean();
    for (i=0; i<listaMoPos.length;i++){
        listaMoPos[i].contador = i+1;  }
   res.render('Inventarios/mopos', {listaMoPos,listaCategorias}); 
});
router.post('/mopos/add', isAuthenticated, async (req, res) => {
    const {nombreMoPo,seleccionCategoria, descripcionMoPo}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     const nombreDup = await MoPo.findOne({nombreMoPo: nombreMoPo});
     let listaMoPos = await MoPo.find().lean();
     const listaCategorias = await Categoria.find().lean();
    for (i=0; i<listaMoPos.length;i++){
        listaMoPos[i].contador = i+1;
    }
     if(!nombreMoPo){
        errors.push({text: 'ERROR: Porfavor Introduzca nombre de Materia Prima'});
     }
     if(seleccionCategoria == '...'){
        errors.push({text: 'ERROR: Porfavor Introduzca Categoria'});
     }
     if(nombreDup){
        errors.push({text: 'ERROR: La Materia Prima ya existe'})
    }
     if(errors.length > 0){
         res.render('Inventarios/mopos', {
            errors,
            nombreMoPo,
            listaMoPos,
            listaCategorias,
            descripcionMoPo});
     }
     else{
         const nuevaMoPo =  new MoPo({ nombreMoPo,seleccionCategoria,descripcionMoPo});
        /* nuevoProveedor.user = req.user.id; */
         await nuevaMoPo.save(); 
         req.flash('success_msg', 'Materia Prima añadida correctamente');
        res.redirect('/inventarios/mopos'); 
     }  
 });

router.get('/mopos/edit/:id', isAuthenticated, async (req,res) =>{
    const mopo = await MoPo.findById(req.params.id).lean();
    const listaCategorias = await Categoria.find().lean();
    res.render('Inventarios/editMoPos', { mopo,listaCategorias });
});
router.put('/mopos/editMoPo/:id', isAuthenticated, async (req, res) => {
    const {nombreMoPo,seleccionCategoria, descripcionMoPo} = req.body;
    await MoPo.findByIdAndUpdate(req.params.id, {nombreMoPo,seleccionCategoria, descripcionMoPo});
    req.flash('success_msg', 'Materia Prima actualizada correctamente');
    res.redirect('/inventarios/mopos');
   }); 



/* |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/*                            Productos                                                                    */

router.get('/inventarios/productos', isAuthenticated, async (req,res) =>{ 
    const listaCategorias = await Categoria.find().lean();
    let listaProductos = await Producto.find().lean();
    for (i=0; i<listaProductos.length;i++){
        listaProductos[i].contador = i+1;  }
   res.render('Inventarios/productos', {listaProductos,listaCategorias}); 
});
router.post('/productos/add', isAuthenticated, async (req, res) => {
    const {nombreProducto,seleccionCategoria, descripcionProducto}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     const nombreDup = await Producto.findOne({nombreProducto: nombreProducto});
     let listaProductos = await Producto.find().lean();
     const listaCategorias = await Categoria.find().lean();
    for (i=0; i<listaProductos.length;i++){
        listaProductos[i].contador = i+1;
    }
     if(!nombreProducto){
        errors.push({text: 'ERROR: Porfavor Introduzca nombre de Producto'});
     }
     if(seleccionCategoria == '...'){
        errors.push({text: 'ERROR: Porfavor Introduzca Categoria'});
     }
     if(nombreDup){
        errors.push({text: 'ERROR: El Producto ya existe'})
    }
     if(errors.length > 0){
         res.render('Inventarios/productos', {
            errors,
            nombreProducto,
            listaProductos,
            listaCategorias,
            descripcionProducto});
     }
     else{
         const nuevoProducto =  new Producto({ nombreProducto,seleccionCategoria,descripcionProducto});
        /* nuevoProveedor.user = req.user.id; */
         await nuevoProducto.save(); 
         req.flash('success_msg', 'Producto añadida correctamente');
        res.redirect('/inventarios/productos'); 
     }  
 });

router.get('/productos/edit/:id', isAuthenticated, async (req,res) =>{
    const producto = await Producto.findById(req.params.id).lean();
    const listaCategorias = await Categoria.find().lean();
    res.render('Inventarios/editProductos', { producto,listaCategorias });
});
router.put('/productos/editProducto/:id', isAuthenticated, async (req, res) => {
    const {nombreProducto,seleccionCategoria, descripcionProducto} = req.body;
    await Producto.findByIdAndUpdate(req.params.id, {nombreProducto,seleccionCategoria, descripcionProducto});
    req.flash('success_msg', 'Producto actualizado correctamente');
    res.redirect('/inventarios/productos');
   }); 









/* |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/*                            Existencias                                                                    */

router.get('/inventarios/existencias', isAuthenticated, async (req, res) => {
    const listaCategorias = await Categoria.find().lean();
    const listaMoPos = await MoPo.find().lean();
    const listaProductos = await Producto.find().lean();
    const CEx = 100001 + (await Existencia.countDocuments()) + (await ExistenciaArchivada.countDocuments());
    const  CLID = ("L"+CEx);
    let listaExistencias = await Existencia.find().lean();
    for (i=0; i<listaExistencias.length;i++){
        listaExistencias[i].contador = i+1;  }
  
        res.render('Inventarios/existencias', {CLID,listaExistencias,listaCategorias,listaMoPos,listaProductos}); 
  
    });


router.post('/existencias/add', isAuthenticated, async (req, res) => {
    const {ingresoMoPo,ingresoProducto,ingresoCantidad,CodeLoteId,fechaVencimientoIngreso,descripcionIngreso}= req.body;
    //PROCESO DE VALIDACION
    const cantidadDeInicio = ingresoCantidad; 
     const errors = [];
     const LoteIDDup = await Existencia.findOne({CodeLoteId: CodeLoteId});
     /* await Existencia.update({CodeLoteId: CodeLoteId},{$set:{cantidadDeIngreso:ingresoCantidad}}); */
     
     let listaExistencias = await Existencia.find().lean();
     const listaMoPos = await MoPo.find().lean();
    const listaProductos = await Producto.find().lean();
    
    const CEx = 100001 + (await Existencia.countDocuments()) + (await ExistenciaArchivada.countDocuments());
    const  CLID = ("L"+CEx);
    for (i=0; i<listaExistencias.length;i++){
        listaExistencias[i].contador = i+1;
    }
    if(ingresoMoPo == '...'){
        if(ingresoProducto == '...'){
           errors.push({text: 'ERROR: Porfavor elija elemento a ingresar'});}
     }
     if(ingresoMoPo != '...'){
        if(ingresoProducto != '...'){
           errors.push({text: 'ERROR: Solo se puede elegir una clase de elemento'});}
     }
     if(!ingresoCantidad){
        errors.push({text: 'ERROR: Porfavor Introduzca Cantidad del Elemento'});
     }
     if(ingresoCantidad <= 0){
        errors.push({text: 'ERROR: Porfavor Introduzca una cantidad Mayor a 0'});
     }
     if(!CodeLoteId){
        errors.push({text: 'ERROR: Lote_ID vacio, contactese con el administrador'});
     }
     if(LoteIDDup){
        errors.push({text: 'ERROR: El Lote_ID ya existe, contactese con el administrador'})
     }
     if(!fechaVencimientoIngreso){
        errors.push({text: 'ERROR: Por Favor introduzca fecha de vencimiento'})
     }
     if(errors.length > 0){
         res.render('Inventarios/existencias', {
            errors,
            ingresoCantidad,
            CodeLoteId,
            CLID,
            listaExistencias,
            cantidadDeIngreso,
            fechaVencimientoIngreso,
            listaMoPos,listaProductos,
            descripcionIngreso});
     }
     else{
    
         const nuevaExistencia =  new Existencia({ ingresoMoPo,ingresoProducto,ingresoCantidad,cantidadDeInicio,CodeLoteId,fechaVencimientoIngreso,descripcionIngreso});
        /* nuevoProveedor.user = req.user.id; */
         await nuevaExistencia.save(); 
         req.flash('success_msg', 'Ingreso registrado correctamente');
        res.redirect('/inventarios/existencias'); 
     }  
 });




 router.get('/existencias/retiro/:id', isAuthenticated, async (req,res) =>{
    const existencia = await Existencia.findById(req.params.id).lean();
    const elemento = ".";
    if (existencia.ingresoMoPo == "..."){
        existencia.elemento = existencia.ingresoProducto;
    }
    else{
        existencia.elemento = existencia.ingresoMoPo;
    }
    res.render('Inventarios/retiroExistencias', { existencia }); 
});
router.put('/existencias/retiroExistencia/:id', isAuthenticated, async (req, res) => {
    const errors = [];
    const {retiroCantidad} = req.body;
    const existencia = await Existencia.findById(req.params.id).lean();
    let listaExistencias = await Existencia.find().lean();
    for (i=0; i<listaExistencias.length;i++){
        listaExistencias[i].contador = i+1;
    }
    if(retiroCantidad <= 0){
        errors.push({text: 'ERROR: Porfavor Introduzca una cantidad a retirar Mayor a 0'});
     }
    if(retiroCantidad > existencia.ingresoCantidad){
        errors.push({text: 'ERROR: No se dispone la cantidad indicada, por favor introduzca una cantidad disponible'});
     }
     if(errors.length > 0){
        res.render('Inventarios/existencias', {
           errors,listaExistencias
         });
    }else{
        const resta = existencia.ingresoCantidad - retiroCantidad;
        await Existencia.findByIdAndUpdate(req.params.id, {ingresoCantidad: resta});
        req.flash('success_msg', 'Retiro Registrado correctamente');
        if(resta == 0){
            await ExistenciaArchivada.insertMany({ 
                _id: existencia._id,
                ingresoMoPo: existencia.ingresoMoPo,
                ingresoProducto: existencia.ingresoProducto,
                ingresoCantidad: existencia.cantidadDeInicio,
                CodeLoteId: existencia.CodeLoteId,
                fechaVencimientoIngreso: existencia.fechaVencimientoIngreso,
                descripcionIngreso: existencia.descripcionIngreso,
                date: existencia.date});
            await Existencia.deleteOne({ingresoCantidad: 0});
        }
        res.redirect('/inventarios/existencias');
/* let existenciaArchivada = await ExistenciaArchivada.find().lean();
        res.send({existenciaArchivada}) */
    }
  }); 










/* |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/*                            Historial (existencias archivadas)                                                                    */


router.get('/inventarios/historial',  isAuthenticated,  async (req,res) =>{ 
     let listaExistenciasArchivadas = await ExistenciaArchivada.find().lean();
    for (i=0; i<listaExistenciasArchivadas.length;i++){
        listaExistenciasArchivadas[i].contador = i+1;
    } 
    res.render('Inventarios/historial',{listaExistenciasArchivadas}); 
});













module.exports = router;