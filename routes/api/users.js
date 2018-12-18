var express = require('express');
var router = express.Router();

var User = require('../../controllers/api/users')


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
    User.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na inserção de utilizador'))
})


module.exports = router;
