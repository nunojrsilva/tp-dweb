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
var Pubs = require('../../controllers/pubs')


// router.get('/', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req,res) => {
//     User.listar()
//         .then(dados => res.jsonp(dados))
//         .catch(erro => res.status(500).send('Erro na listagem de utilizadores' + erro))
// })

router.get('/FotosPerfil', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res)=>{
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

router.get('/atualizarFotoPerfil', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res)=>{
    console.log("Entrou no get de /users/FotosPerfil " + req.user._id + "ID DA FOTO " + req.query.fotoId)

    User.atualizarFotoPerfil(req.user._id, req.query.fotoId)
    .then(user => {
        console.log(JSON.stringify(user))
        res.redirect("http://localhost:3000/Perfil")
    })
    .catch(erroFoto => res.status(500).send('ERRO AO TENTAR ATUALIZAR A FOTO DE PERFIL ' + erroFoto))
   
})

router.post('/Seguir', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res)=>{

    User.inserirSeguidor(req.body.userParaSeguir, req.user._id)
    .then(_ =>{
            
        User.inserirASeguir(req.user._id, req.body.userParaSeguir)
        .then(_ =>{
            res.json(req.body.userParaSeguir._id)
        })
        .catch(erroInserirASeguir =>{
            console.log("ERRO AO ADICIONAR UTILIZADOR A LISTA DE A SEGUIR " + erroInserirASeguir)
            res.status(500).send("ERRO AO ADICIONAR UTILIZADOR A LISTA DE A SEGUIR " + erroInserirASeguir)
        })
    })
    .catch(erroSerSeguido =>{
        console.log("ERRO AO ADICIONAR UTILIZADOR A LISTA DE SEGUIDORES " + erroSerSeguido)
        res.status(500).send("ERRO AO ADICIONAR UTILIZADOR A LISTA DE SEGUIDORES " + erroSerSeguido)
    })
})

router.post('/Ignorar', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res)=>{
    
    User.removerSeguidor(req.body.userAIgnorar, req.user._id)
    .then(_=>{
        User.removerASeguir(req.user._id, req.body.userAIgnorar)
        .then(_=>{
            res.jsonp(req.body.userAIgnorar)
        })
        .catch(erroASeguir =>{
            console.log("ERRO AO REMOVER USER DA LISTA DE USERS A SEGUIR " + erroASeguir)
            res.status(500).send("ERRO AO REMOVER USER DA LISTA DE USERS A SEGUIR " + erroASeguir)
        })
    })
    .catch(erroSeguidor =>{
        console.log("ERRO AO REMOVER USER DA LISTA DE USERS SEGUIDORES " + erroSeguidor)
        res.status(500).send("ERRO AO REMOVER USER DA LISTA DE USERS SEGUIDORES " + erroSeguidor)
    })
})


router.get('/Perfil', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res)=>{
    console.log("Entrou no get de /Perfil " + req.user._id)
    var userID = null
    var proprioPerfil = null
   
    if((req.body.idUser == req.user._id) || (req.body.idUser == undefined)){
        userID = req.user._id
        proprioPerfil = true   
    }
    else{
        userID = req.body.idUser
        proprioPerfil = false
    }
    console.log("ESTE É O USER " + userID)
    User.getIdAtual(userID)
    .then(foto =>{
        User.consultarPerfil(userID, foto[0].fotoPerfil.idAtual)
        .then(userArray => {
            User.getASeguirESeguidores(userID)
            .then(array =>{
                var aSeguir = array[0].aSeguir
                var seguidores = array[0].seguidores
                var user = userArray[0]
                user.aSeguir = aSeguir
                user.seguidores = seguidores
                user.naSeguir = aSeguir.length
                user.nseguidores = seguidores.length

                if(proprioPerfil){
                    Pubs.listarPorUser(user._id)
                    .then(pubs =>{
                        user.pubs = pubs
                        user.npubs = pubs.length
                        user.otherUser = false
    
                        res.jsonp(user)
                    })
                    .catch(erroProprio =>{
                        console.log(erroProprio)
                        res.status(500).send("ERRO AO TENTAR CARREGAR AS PRÓPRIAS PUBS " + erroProprio)
                    })
                }
                else{
                    User.checkASeguir(req.user._id, user._id)
                            .then(n =>{
                                if(n >= 1){
                                    user.segue = true
                                    console.log(user.segue + " " + n)
                                    Pubs.listarPubsPerfilSeguidores(user._id)
                                    .then(pubs =>{
                                        console.log("PUBS DO /API/PERFIL")
                                        console.log(JSON.stringify(pubs))
                                        User.contarPubs(user._id)
                                        .then(nPubsTotal =>{
                                            console.log("A CONTAR PUBS")
                                            user.pubs = pubs
                                            user.npubs = nPubsTotal.pubs.length
                                            user.npubsInvisiveis = nPubsTotal.pubs.length - pubs.length
                                            user.otherUser = true
                                            res.json(user)
                                        })
                                        .catch(erroTotal =>{
                                            console.log("ERRO AO CONTAR O TOTAL DE PUBS DE UM USER " + erroTotal)
                                            res.status(500).send("ERRO AO CONTAR O TOTAL DE PUBS DE UM USER " + erroTotal)
                                        })   
                                        })
                                        .catch(erroPubs =>{
                                            console.log(erroPubs)
                                            res.status(500).send("ERRO AO TENTAR CARREGAR AS PUBS DOUTRO USER" + erroPubs)
                                        })
                                }
                                else{
                                    user.segue = false
                                    console.log(user.segue + " " + n)
                                    Pubs.listarPorUserPrivacidade(user._id, "publica")
                                    .then(pubs =>{
                                        console.log("PUBS DO /API/PERFIL")
                                        console.log(JSON.stringify(pubs))
                                        User.contarPubs(user._id)
                                        .then(nPubsTotal =>{
                                            user.pubs = pubs
                                            user.npubs = nPubsTotal.pubs.length
                                            user.npubsInvisiveis = nPubsTotal.pubs.length - pubs.length
                                            user.otherUser = true
                                            res.json(user)
                                            
                                        })
                                        .catch(erroTotal =>{
                                            console.log("ERRO AO CONTAR O TOTAL DE PUBS DE UM USER " + erroTotal)
                                            res.status(500).send("ERRO AO CONTAR O TOTAL DE PUBS DE UM USER " + erroTotal)
                                        })

                                    
                                    })
                                }
                            })
                            .catch(erroCount =>{
                                console.log("ERRO A VERIFICAR SE JA SEGUE O UTILIZADOR " + erroCount)
                                res.status(500).send("ERRO A VERIFICAR SE JA SEGUE O UTILIZADOR " + erroCount)
                            })
                   
    
                }
            })
            .catch(errorASeguir =>{
                    console.log("ERRO AO CONSULTAR A LISTA DE UTILIZADORES A SEGUIR " + errorASeguir)
                    res.status(500).send("ERRO AO CONSULTAR A LISTA DE UTILIZADORES A SEGUIR " + errorASeguir)
            })

        })
        .catch(erroFoto => res.status(500).send('ERRO AO TENTAR OBTER PERFIL DO USER COM ID ' + userID + erroFoto))

    })
    
})

router.get('/aSeguir',passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res)=>{
    User.getASeguir(req.body.idUser)
    .then(aSeguirArray =>{
        console.log(JSON.stringify(aSeguirArray))
        res.jsonp(aSeguirArray[0])
    })
    .catch(erro =>{
        console.log("ERRO AO OBTER A LISTA DE UTILIZADORES A SEGUIR " + erro)
        res.status(500).send("ERRO AO OBTER A LISTA DE UTILIZADORES A SEGUIR " + erro)
    })
})


router.get('/Seguidores',passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res)=>{
    User.getSeguidores(req.body.idUser)
    .then(SeguidoresArray =>{
        console.log(JSON.stringify(SeguidoresArray[0]))
        res.jsonp(SeguidoresArray[0])
    })
    .catch(erro =>{
        console.log("ERRO AO OBTER A LISTA DE SEGUIDORES " + erro)
        res.status(500).send("ERRO AO OBTER A LISTA DE SEGUIDORES " + erro)
    })
})

router.get('/:uid', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req,res) => {
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
                if (err) {
                    res.status(500).send(err)
                    return next(err)
                }
                else {
                    res.status(500).send("Utilizador não existe!")
                    return new Error('Utilizador inexistente')
                }
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
                res.status(500).send("Erro no login")
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
        return res.jsonp(user)
    })(req, res, next);
})

router.post('/novaFotoPerfil', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) => {
    console.log("CHEGUEI AO /novaFotoPerfil " + req.user._id + JSON.stringify(req.body.foto))
    console.log(JSON.stringify(req.body.foto))
    User.inserirFotoPerfil(req.user._id, req.body.foto)
    .then(dados =>{
        res.jsonp(dados)
    })
    .catch(erroGuardarFoto => res.status(500).send("ERRO AO TENTAR GUARDAR A FOTO DE PERFIL " + erroGuardarFoto))

})




module.exports = router;
