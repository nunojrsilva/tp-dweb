var express = require('express');
var router = express.Router();

var Pubs = require('../../controllers/api/pubs')


router.get('/', (req,res) => {
    console.log("Entrou no get de /pubs")
    Pubs.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de publicações'))
})

router.get('/:pid', (req,res) => {
    Pubs.consultar(req.params.pid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta da publicação ' + req.params.pid))
})

router.get('/publico/:value', (req, res) => {
	Pubs.listarPublico(req.params.value)
		.then(dados => res.jsonp(dados))
		.catch(erro => res.status(500).send('Erro na listagem de publicações por tipo: ' + erro))
});

router.get('/hashtag/:ht', (req, res) => {
	Pubs.listarHashtag(req.params.ht)
		.then(dados => res.jsonp(dados))
		.catch(erro => res.status(500).send('Erro na listagem de publicações por tipo: ' + erro))
});

router.get('/tipo/:t', (req, res) => {
	Pubs.listarTipo(req.params.t)
		.then(dados => res.jsonp(dados))
		.catch(erro => res.status(500).send('Erro na listagem de publicações por tipo: ' + erro))
});

router.get('/data/:d', (req, res) => {
	Pubs.listarData(req.params.d)
		.then(dados => res.jsonp(dados))
		.catch(erro => res.status(500).send('Erro na listagem de publicações por data: ' + erro))
});


router.post('/', (req,res) => {
    Pubs.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na inserção da publicação'))
})


router.delete('/:pid', (req,res) => {
    Pubs.remover(req.params.pid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta da publicação ' + req.params.pid))
})

module.exports = router;
