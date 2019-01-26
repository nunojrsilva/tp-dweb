var express = require('express');
var router = express.Router();
let fs = require('fs');

var passport = require('passport')

var jwt = require('jsonwebtoken')

var User = require('../../controllers/users')

var UserModel = require('../../models/users')


router.get('/', passport.authenticate('jwt', {session : false}), (req,res) => {
    console.log("Entrou no get de /users, é protegido")
    console.log(req.headers)
    console.log(req.headers['authorization'])
    //console.log(req.user)
    User.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de utilizadores'))
})

router.get('/:uid', passport.authenticate('jwt', {session : false}), (req,res) => {
    User.consultar(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta do Utilizador ' + req.params.uid))
})
//                                 CRIACAO DE UTILIZADOR 
// Usando passport para autenticacao, é o passport que insere o utilizador , ver auth.js
router.post('/', function(req, res, next) {
    console.log("Entrei no post de /api/users")
    passport.authenticate('registo', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.jsonp({erro: "Utilizador não existe"}); }
      console.log("Body no post de /api/users " + JSON.stringify(req.body))
      console.log("Passport já atuou")
      fs.mkdirSync(__dirname + '/../../uploaded/'+req.body.username+'/')
      console.log("Pasta criada")
      return res.jsonp(user)
      })(req, res, next);
})

router.post('/login', async (req,res,next) => {
    console.log("No login da api")
    //console.log(req)
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                if (err) return next(err)
                else return new Error('Utilizador inexistente')
            }
            req.login(user, {session : false }, async (error) => {
                console.log("login com sucesso na api")
                if (error) return next.error
                var myuser = {_id : user._id, username : user.username};

                var token = jwt.sign({
                    user : myuser}, 'dweb2018');
                
                // req.session.token = token
                // // next()
                // // res.redirect("/api/users")
                res.send({token})

                })
            }
        catch (error) {
                return next(error)
        }
    })(req,res,next);
})




module.exports = router;
