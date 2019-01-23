var express = require('express');
var router = express.Router();
var axios = require('axios')


router.get('/', function(req, res) {
	if(req.query.username && req.query.publico){
		axios.get('http://localhost:3000/api/pubs?username=' + req.query.username + '&publico=' + req.query.publico)
        .then(resposta => res.render('listaPubs', {pubs : resposta.data}))
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else if(req.query.username){
		axios.get('http://localhost:3000/api/pubs?username=' + req.query.username)
        .then(resposta => res.render('listaPubs', {pubs : resposta.data}))
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
        })
    } else if(req.query.hashtag){
		axios.get('http://localhost:3000/api/pubs?hashtag=' + req.query.hashtag)
		.then(resposta => res.render('listaPubs', { pubs: resposta.data }))
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else if(req.query.data){
		axios.get('http://localhost:3000/api/pubs?data=' + req.query.data)
		.then(resposta => res.render('listaPubs', { pubs: resposta.data }))
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else{
		axios.get('http://localhost:3000/api/pubs')
		.then(resposta => res.render('listaPubs', { pubs: resposta.data }))
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	}
});

router.get('/novalista', (req,res) => {
    console.log("Entrou no get de /pubs/lista")
    res.render("lista")
})


router.get('/novaPubFich', function(req, res) {
	res.render('ficheirosReg')
});

router.get('/novoEvento', (req, res) => {
	res.render('evento')
});

router.get("/narracao", (req,res) => {
	res.render("narracao")
})
router.get('/opiniao', function(req, res) {
	res.render('opiniao')
});

router.get('/opiniaoPub', (req,res) => {
    res.render("opiniaoPub")
})

router.get('/narracaoPub', (req,res) => {
    res.render("narracaoPub")
})

router.get('/ficheirosPub', (req,res) => {
    res.render("ficheirosPub")
})

router.get('/publicar', function(req, res) {
	res.render('publicar')
});

module.exports = router;