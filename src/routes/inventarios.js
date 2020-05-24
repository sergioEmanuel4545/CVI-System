const express = require('express');
const router = express.Router();


const Categoria = require('../models/Categoria');
/* const Compra = require('../models/Compra'); */
const { isAuthenticated } = require('../helpers/auth');



router.post('/categorias/add', isAuthenticated, async (req, res) => {
    const {nombreCategoria, descripcionCategoria}= req.body;
    //PROCESO DE VALIDACION
     const errors = [];
     if(!nombreCategoria){
        errors.push({text: 'Porfavor Introduzca nombre de Categoria'});
     }
     if(errors.length > 0){
         res.render('Inventarios/addCategorias', {
            errors,
            nombreCategoria,
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

router.get('/inventarios/categorias', isAuthenticated, async (req,res) =>{ 
    let listaCategorias = await Categoria.find().lean();
    for (i=0; i<listaCategorias.length;i++){
        listaCategorias[i].contador = i+1;
    }
   res.render('Inventarios/categorias', {listaCategorias}); 
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












router.get('/inventarios/existencias', (req, res) => {
res.render('Inventarios/existencias');})

















router.get('/inventarios/mopos', /* isAuthenticated, */ async (req,res) =>{ 
    /* let listaProveedores = await Proveedor.find().lean();
    for (i=0; i<listaProveedores.length;i++){
        listaProveedores[i].contador = i+1;
    } */
    res.render('Inventarios/mopos'); 
});








router.get('/inventarios/productos', /* isAuthenticated, */ async (req,res) =>{ 
    /* let listaProveedores = await Proveedor.find().lean();
    for (i=0; i<listaProveedores.length;i++){
        listaProveedores[i].contador = i+1;
    } */
    res.render('Inventarios/productos'); 
});












router.get('/inventarios/historial', /* isAuthenticated, */ async (req,res) =>{ 
    /* let listaProveedores = await Proveedor.find().lean();
    for (i=0; i<listaProveedores.length;i++){
        listaProveedores[i].contador = i+1;
    } */
    res.render('Inventarios/historial'); 
});













module.exports = router;