const Localstrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new Localstrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:"email is not registered"});
                }
                bycrypt.compare(password,user.password,(err,ismatch)=>{
                    if(err) throw err;
                    if(ismatch){
                        done(null,user)
                    }
                    else{
                        done(null,false,{message:"your password is incoorect "});
                    }
                })
            })
            .catch(err=>console.log(err));

        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}