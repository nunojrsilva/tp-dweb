var express = require('express');
var router = express.Router();
var fs = require('fs')
var formidable = require('formidable')


var Pubs = require('../../controllers/pubs')
var User = require('../../controllers/users')


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
    completaPubLista(req.body).then( 
        listaPronta => {

        Pubs.inserir(listaPronta)
            .then(dados => res.jsonp(dados))
            .catch(erro => {
                console.log(erro)
                res.status(500).send('Erro na inserção da publicação' + erro)
            })
    })
})


router.post('/ficheiros', (req, res) => {
	var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log('fields: \n' + JSON.stringify(fields))             
            console.log('files: \n' + JSON.stringify(files))
            User.consultarUsername(fields.username)
                .then(un => {     
                    console.log('fields: \n' + JSON.stringify(fields))             
                    console.log('files: \n' + JSON.stringify(files))       
                    var publicacao = {}
                    publicacao.utilizador = un
                    publicacao.data = new Date()
                    publicacao.tipo = "ficheiros"
                    publicacao.publico = false

                    ficheirosArray = []

                    for(var fich in files){

                        var fenviado = files[fich].path
                        var fnovo = __dirname + '/../../public/uploaded/'+files[fich].name
                        
                        fs.rename(fenviado, fnovo, erro1 => {
                            console.log('entrei no rename')  
                            
                            if(erro1){
                                console.log('errou no rename: ' + erro1) 
                                res.status(500)
                                res.write('Ocorreram erros no parse do form: ' + erro1)
                                res.end()
                            }
                        })
                        ficheirosArray.push(files[fich].name)
                    }
                    var elem = {}
                    elem.hashtags = ["ficheiros"]
                    elem.ficheiros = {}
                    elem.ficheiros.titulo = fields.fTitulo
                    elem.ficheiros.ficheiros = ficheirosArray
                    publicacao.elems = [elem]

                    console.log("-----------------------------------PUBLICAÇÃO-----------------------------------")
                    console.log(JSON.stringify(publicacao))
                    console.log("--------------------------------------------------------------------------------")

                    Pubs.inserir(publicacao)
                        .then(dados => {
                            console.log('entrei no then do inserir publicação\n' + JSON.stringify(dados))                            
                            res.render("respostaPub", {pub : dados})
                        })
                        .catch(erro2 => {
                            console.log('Errei no inserir publicação\n' + erro2)
                            res.status(500).send('2 na inserção de publicações: ' + erro2)
                        })
                })
                .catch(erro3 => {
                    res.status(500).send("Erro no consultarUsername do post de ficheiros : " + erro3)
                })
		}
		else{
			console.log('errou no parse: ' + erro) 
			res.status(500)
			res.write('Ocorreram erros no parse do form: ' + erro)
			res.end()
		}
    })
});


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

    var promise = new Promise( function(resolve, reject) {
        // do a thing, possibly async, then…
        console.log("No inicio do completaPubLista, " + JSON.stringify(ObjLista))
        User.consultarUsername(ObjLista.username)
            .then(un => {
                var novaLista = {}
                novaLista.utilizador = un
                novaLista.data = new Date()
                novaLista.tipo = "lista"
                novaLista.publico = false
                novaLista.elems = completaElemLista(ObjLista)
                resolve (novaLista)
            })  
            .catch(erro => {
                console.log("Erro no consultarUsername da completaPubLista : " + erro)
                reject({})
            })

        });

    return promise    
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
