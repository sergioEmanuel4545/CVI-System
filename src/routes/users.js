const express = require('express');
const router = express.Router();

const passport = require('passport');   


const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true          
})); 

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name,email,password,confirm_password } = req.body;
    const errors = [];
    const emailUser = await User.findOne({email: email});
    if (name.length <= 0){
        errors.push({text: 'Debe insertar un nombre de usuario'});
    }
    if (password.length < 4){
        errors.push({text: 'La contraseña tiene que ser la menos de 4 caracteres'});
    }
    if (password != confirm_password){
        errors.push({text: 'Constraseñas no coinciden'});
    }
    if(emailUser){
        errors.push({text: 'El correo electronico ya se enceuntra en uso'})
    }
    if (errors.length > 0){
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password});
    } 
    else{
        const newUser = new User  ({name, email, password});
       newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'creacion de cuenta completa');
        res.redirect('/login');
        
    }
}); 


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
}); 

module.exports = router;