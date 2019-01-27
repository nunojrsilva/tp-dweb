var express = require('express');
var router = express.Router();
let fs = require('fs');
var hash = require('crypto').createHash;
var formidable = require('formidable')
var path = require('path');
var randomstring = require('randomstring')
var querystring = require('querystring')



var passport = require('passport')

var jwt = require('jsonwebtoken')

var User = require('../../controllers/users')


router.get('/', passport.authenticate('jwt', {session : false}), (req,res) => {
    console.log("Entrou no get de /users, é protegido")
    console.log(req.headers)
    console.log(req.headers['authorization'])
    //console.log(req.user)
    User.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de utilizadores' + erro))
})

router.get('/FotosPerfil', passport.authenticate('jwt', {session : false}), (req, res)=>{
    console.log("Entrou no get de /users/FotosPerfil " + req.user._id)

    User.obterFotosPerfil(req.user._id)
    .then(fotosArray => {
        var fotosObj = fotosArray[0]
        res.jsonp(fotosObj)
    })
    .catch(erroFotos => res.status(500).send('Erro na listagem de fotos de um utilizador' + erroFotos))
   
})

router.get('/FotoPerfil', (req, res)=>{
    console.log("Entrou no get de /users/FotoPerfil " + req.query.idUserPublicacao)

    User.getIdAtual(req.query.idUserPublicacao)
    .then(obj =>{
        console.log(obj[0])
        User.obterFotoPerfil(req.query.idUserPublicacao, obj[0].fotoPerfil.idAtual)
        .then(fotosArray => {
            var fotosObj = fotosArray[0]
            res.jsonp(fotosObj)
        })
        .catch(erroFotos => res.status(500).send('Erro na listagem de fotos de um utilizador' + erroFotos))
    })
    .catch(erroID => res.status(500).send('Erro ao obter o id da foto de perfil atual' + erroID))
   
   
})

router.get('/atualizarFotoPerfil', passport.authenticate('jwt', {session : false}), (req, res)=>{
    console.log("Entrou no get de /users/FotosPerfil " + req.user._id + "ID DA FOTO " + req.query.fotoId)

    User.atualizarFotoPerfil(req.user._id, req.query.fotoId)
    .then(user => {
        console.log(JSON.stringify(user))
        res.redirect("http://localhost:3000/FotosPerfil")
    })
    .catch(erroFoto => res.status(500).send('ERRO AO TENTAR ATUALIZAR A FOTO DE PERFIL ' + erroFoto))
   
})

router.get('/:uid', passport.authenticate('jwt', {session : false}), (req,res) => {
    User.consultar(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta do Utilizador ' + erro + req.params.uid))
})
//                                 CRIACAO DE UTILIZADOR 
// Usando passport para autenticacao, é o passport que insere o utilizador , ver auth.js

router.post('/login', async (req,res,next) => {
    console.log("No login da api")
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
                
                res.send({token})

                })
            }
        catch (error) {
                return next(error)
        }
    })(req,res,next);
})

router.post('/', function(req, res, next) {
    console.log("Entrei no post de /api/users")
    passport.authenticate('registo', function(err, user, info){
        if (err) { return next(err); }
        if (!user) { return res.jsonp({erro: "Utilizador não existe"}); }
        console.log("Body no post de /api/users " + JSON.stringify(req.body))
        console.log("Passport já atuou")
        console.log("User : " + user)
        fs.mkdirSync(__dirname + '/../../uploaded/'+ user.username +'/')
        fs.mkdirSync(__dirname + '/../../uploaded/'+ user.username +'/fotos/')
        //return res.jsonp(user)

        User.atualizarFotoPerfil(user._id, user.fotoPerfil.fotos[0]._id)
            .then(dados2 =>{
                return res.jsonp(dados2)
            })
            .catch(e =>
                { 
                console.log("Erro ao atualizar foto" + e)
                return res.jsonp(e)
            })
    })(req, res, next);
})

router.post('/novaFotoPerfil', passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log("CHEGUEI AO /novaFotoPerfil " + req.user._id + JSON.stringify(req.body.foto))
    console.log(JSON.stringify(req.body.foto))
    User.inserirFotoPerfil(req.user._id, req.body.foto)
    .then(dados =>{
        res.jsonp(dados)
    })
    .catch(erroGuardarFoto => res.status(500).send("ERRO AO TENTAR GUARDAR A FOTO DE PERFIL " + erroGuardarFoto))

})




module.exports = router;
