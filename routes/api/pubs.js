var express = require('express');
var router = express.Router();

var Pubs = require('../../controllers/api/pubs')
var User = require('../../controllers/api/users')


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

/////////////////////////////////////////////////////////
///////////////////POSTS/////////////////////////////////
/////////////////////////////////////////////////////////

router.post('/lista', (req,res) => {
    console.dir("Dentro do /api/pubs/lista")
    listaPronta = completaPubLista(req.body)
    console.dir("ESTA É A LISTA PRONTA: \n" + listaPronta)
    Pubs.inserir(listaPronta)
        .then(dados => res.jsonp(dados))
        .catch(erro => {
            console.log(erro)
            res.status(500).send('Erro na inserção da publicação' + erro)
        })
})

/////////////////////////////////////////////////////////
///////////////////DELETES///////////////////////////////
/////////////////////////////////////////////////////////

router.delete('/:pid', (req,res) => {
    Pubs.remover(req.params.pid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro ao apagar publicação ' + req.params.pid))
})

/////////////////////////////////////////////////////////
///////////////////FUNCOES///////////////////////////////
/////////////////////////////////////////////////////////

function completaPubLista (ObjLista){
    try{
    console.log("No inicio do completaPubLista, " + JSON.stringify(ObjLista))
    var novaLista = {}
    User.consultarUsername(ObjLista.username)
        .then(un => {
            novaLista.utilizador = un
            novaLista.data = new Date()
            novaLista.tipo = "lista"
            novaLista.publico = false
            novaLista.elems = completaElemLista(ObjLista)
            return novaLista
        })
        .catch(erro => console.log("DEU ERRO NA FUN FANTASTICA DO NUNO\n" + erro))
    }

    catch(e){
        console.log("ERA AQUI SIM SR\n" + e)
    }
    
}

function completaElemLista (ObjLista) {
    console.log("No inicio do completaElemLista")
    var Elem = {}
    Elem.hashtags = ["lista"]
    var lista = {}
    lista.titulo = ObjLista.titulo
    lista.itens = []
    var atual = "item"
    console.log(Object.keys(ObjLista).length)
    for (var i = 1; i <= Object.keys(ObjLista).length - 2; i++) {
         atual = "item" + i
         console.log("item" + i + " = " + ObjLista[atual])
         lista.itens.push(ObjLista[atual])
     }
    Elem.lista = lista
    console.log("No final do completaElemLista, " + JSON.stringify(Elem))
    return [Elem]
}

module.exports = router;
