const express = require('express');

const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport=require('passport')
router.get('/login', (req, res) => res.render("login"));

router.get('/Register', (req, res) => res.render("register"));

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = []

    if (!name || !email || !password || !password) {
        errors.push({ msg: 'please fill all the fields' });
    }
    if (password !== password2) {
        errors.push({ msg: `passwords don't match` })
    }
    if (password.length < 6) {
        errors.push({ msg: 'password should be more than 6 characters' })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'email is already registered' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                        
                    });
                    

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password=hash;
                            newUser.save()
                            .then(user=>{
                                req.flash('sucess_msg','you are now registered and can log in');
                                res.redirect('/users/login')
                            })
                            .catch(err=>console.log(err))

                        }))

                }
            })

    }
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);

});
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('sucess_msg','you are logged out')
    res.redirect('/users/login')
})
module.exports = router;
