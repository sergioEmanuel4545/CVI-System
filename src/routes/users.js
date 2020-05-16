const express = require('express');
const router = express.Router();

const passport = require('passport');   


const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
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
    if (name.length <= 0){
        errors.push({text: 'you must insert a name'});
    }
    if (password.length < 4){
        errors.push({text: 'password has to have at least 4 characters'});
    }
    if (password != confirm_password){
        errors.push({text: 'password dont match'});
    }
    if (errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    } 
    else{
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'The Email is already in use');
            res.redirect('/users/signup');
        }
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