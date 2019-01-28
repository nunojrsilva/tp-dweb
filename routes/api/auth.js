var passport = require('passport')

var jwt = require('jsonwebtoken')

var User = require('../../controllers/users')

var express = require('express');
var router = express.Router();
var axios = require('axios')

// Módulo criado para suportar autenticação via facebook




router.get('/facebook/callback', passport.authenticate('facebook', { session : false, failureRedirect: '/' }),
  function(req, res) {
    
    console.log("User: " + req.user)
    var myuser = {_id : req.user._id, username : req.user.username};
    var token = jwt.sign({user : myuser}, 'dweb2018')

    console.log("Token gerado na API : " + token)
    
    // Enviar token para o utilizador

    res.send({token})
    
    //req.session.token = token
    //res.redirect('/')
  })


  module.exports = router;

