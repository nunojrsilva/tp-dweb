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

router.get('/lista', (req,res) => {
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

router.post('/lista', (req,res) => {
    console.log(req.body)
    console.log("Entrou no post de /pubs/lista")
    axios.post("http://localhost:3000/api/pubs/lista", req.body)
        .then((json) => {
            console.log("RESULTADO DO AXIOS\n" + JSON.stringify(json.data))
            res.render("respostaPub", {pub : json.data})
        })
        .catch(erro => {
            //console.log(erro) //CUIDADO ISTO É GRANDE PA CARACAS
            res.render('error', {error : erro, message : "Erro ao carregar pubs da BD"})})
})



module.exports = router;