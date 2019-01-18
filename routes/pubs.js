var express = require('express');
var router = express.Router();
var axios = require('axios')
var querystring = require('querystring');

var Pubs = require('../controllers/api/pubs')


router.get('/', (req,res) => {
    console.log("Entrou no get de /pubs")
    axios.get('http://localhost:3000/api/pubs')
    .then(resposta => res.render('listaPubs', {lista : resposta.data}))
    .catch(erro => {
      console.log("Erro ao carregar pubs da BD")
      res.render('error', {error : erro, message : "Erro ao carregar compras da BD"})
    })
})


router.get('/lista', (req,res) => {
    console.log("Entrou no get de /pubs/lista")
    res.render("lista")
})

router.post('/lista', (req,res) => {
    console.log(req.body)
    console.log("Entrou no post de /pubs/lista")
    axios.post("http://localhost:3000/api/pubs/lista", req.body)
        .then((json) => {
            console.log(JSON.stringify(json.data))
            res.render("respostaPub", {pub : json.data})
        })
        .catch(erro => {
            console.log(erro)
            res.render('error', {error : erro, message : "Erro ao carregar pubs da BD"})})
})



module.exports = router;