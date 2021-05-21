var expressFunction = require("express");
const router = expressFunction.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var LoginToken = require('./login')
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const key = "MY_KEY";


var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = key; 

const strategy = JwtStrategy(options, (playload , done)=>{
    var result = DB.query(`SELECT Name,Email,Phone FORM register WHERE `)
})

router.get('/profile',passport.authenticate('jwt',{session: false},(req,res,next)=>{
    res.status(200).json()
}))

module.exports = router;