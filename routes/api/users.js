var express = require('express');
var router = express.Router();
let fs = require('fs');
var hash = require('crypto').createHash;
var formidable = require('formidable')
var path = require('path');
var randomstring = require('randomstring')



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

router.get('/atualizarFotoPerfil', passport.authenticate('jwt', {session : false}), (req, res)=>{
    console.log("Entrou no get de /users/FotosPerfil " + req.user._id)

    User.atualizarFotoPerfil(req.user._id, req.body.fotoId)
    .then(user => {
        console.log(JSON.stringify(user))
        res.jsonp(user)
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
        return res.jsonp(user)
    })(req, res, next);
})

router.post('/novaFotoPerfil', (req, res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
        if(!erro){
            if(Object.keys(files).length){
				parseFicheiros(fields, files)
				.then(objFoto => {
                    console.log(JSON.stringify(objFoto))
                    User.inserirFotoPerfil(fields.uid, objFoto)
                    .then(dados =>{
                        console.log("FIELDS")
                        console.log(JSON.stringify(fields))
                        console.log(JSON.stringify(dados.fotoPerfil.fotos[dados.fotoPerfil.fotos.length - 1]))
                        res.render('renderImageToDiv', {foto: dados.fotoPerfil.fotos[dados.fotoPerfil.fotos.length - 1], uid: fields.uid})
                    })
                    .catch(erroGuardarFoto => res.status(500).send("ERRO AO TENTAR GUARDAR A FOTO DE PERFIL " + erroGuardarFoto))
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO "+ erro)
				})
			}
        }
    })
})

async function parseFicheiros(fields, files){
    
    return new Promise((objFoto, erro) =>{
        User.consultar(fields.uid)
        .then(user =>{
            var nome = files.file1.name
            var parts = nome.split('.')
            var extention = "." + parts[parts.length - 1]
            
            
            var pasta = path.resolve(__dirname + '/../../uploaded/' + user.username +'/fotos/')
            
            salt = randomstring.generate(64)

            var foto = {}
            foto.nomeGuardado = hash('sha1').update(fields.uid + nome + salt).digest('hex')
            foto.nome = nome
            
            var fnovo =  pasta + '/' + foto.nomeGuardado + extention
            var fenviado = files.file1.path

            //Verificação da existencia da pasta do dia (será que cria a do utilizador também?)
            if(!fs.existsSync(pasta)){
                fs.mkdirSync(pasta)
            }

            fs.rename(fenviado, fnovo, error => {
                if(error){
                    console.log('errou no rename: ' + error) 
                    erro(error)
                }
                else{
                    objFoto(foto)
                }
            })
        })
        .catch(error => {
            console.log(JSON.stringify(error))
            erro(erro)
        })
    })        
}



module.exports = router;
