var express = require('express');
var router = express.Router();
let fs = require('fs');

var User = require('../../controllers/users')


router.get('/', (req,res) => {
    console.log("Entrou no get de /users")
    User.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de utilizadores'))
})

router.get('/:uid', (req,res) => {
    User.consultar(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta do Utilizador ' + req.params.uid))
})


router.post('/', (req,res) => {
    console.log('Entrei no post de users', req.body)
    User.inserir(req.body)
    .then(dados => {
        console.log('Entrei no then do post de users')
        fs.mkdirSync(__dirname + '/../../uploaded/'+req.body.username+'/');
        res.jsonp(dados)
    })    
    .catch(erro => res.status(500).send('Erro na inserção de utilizador'))
})


module.exports = router;
