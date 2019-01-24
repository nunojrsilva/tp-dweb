var express = require('express');
var router = express.Router();
var axios = require('axios')
var formidable = require('formidable')
var fs = require('fs')




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

router.get('/listaPub', (req,res) => {
    res.render("listaPub")
})

router.get('/eventoPub', (req,res) => {
    res.render("eventoPub")
})

router.get('/publicar', function(req, res) {
	res.render('publicar')
});

////////////////////////////////////////////////////////
//////////////////////POSTS/////////////////////////////
////////////////////////////////////////////////////////

router.post('/opiniao', (req, res) => {
	
	var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
		
			console.log('fields: \n' + JSON.stringify(fields))             
			console.log('files: \n' + JSON.stringify(files))       
			var publicacao = {}
			publicacao.hashtags = ["War", "Terror"]
			publicacao.data = new Date()
			publicacao.publico = fields.publico
			publicacao.elems = []
			var elem1 = {}
			elem1.tipo = "opiniao"
			elem1.opiniao = {}
			elem1.opiniao.opiniao = fields.opiniao
			publicacao.elems.push(elem1)

			if(Object.keys(files).length){
				
				parseFicheiros(fields, files)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(res, publicacao, fields)		
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA OPINIAO"})
		}
    })
});

router.post('/evento', (req, res) => {
    
    var form = new formidable.IncomingForm()

    form.parse(req, (erro, fields, files)=>{
        
        if(!erro){

			console.log('fields: \n' + JSON.stringify(fields))             
			console.log('files: \n' + JSON.stringify(files))       
			
			var publicacao = {}
			publicacao.hashtags = ["Evento"]

			publicacao.data = new Date()
			console.log("ISTO È A PRIVACIDADE", fields.publico)
			publicacao.publico = fields.publico
			publicacao.elems = []

			var elem1 = {}
			elem1.tipo = "evento"
			elem1.evento = {}
			elem1.evento.titulo = fields.titulo
			elem1.evento.atividade = fields.atividade
			elem1.evento.descricao = fields.descricao
			elem1.evento.data = fields.data
			if(fields.duracao)
				elem1.evento.duracao = fields.duracao
			
			publicacao.elems.push(elem1)


			if(Object.keys(files).length){
				parseFicheiros(fields, files)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
				})

			}
			else
				axiosPost(res, publicacao, fields)
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA EVENTO"})
		}	
	})
});

router.post('/ficheiros', (req, res) => {

    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log('fields: \n' + JSON.stringify(fields))             
            console.log('files: \n' + JSON.stringify(files))

			var publicacao = {}
			publicacao.hashtags = ["ficheiros"]
			publicacao.data = new Date()
			publicacao.publico = fields.publico
			publicacao.elems = []

			if(Object.keys(files).length){
				parseFicheiros(fields, files)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
				})
			}
			else
				axiosPost(res, publicacao, fields)
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA FICHEIROS"})
		}
	})	
		
});

router.post("/narracao", (req,res) => {
    var form = new formidable.IncomingForm()
    console.log("Post de /narracao")
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")
            console.log('fields form: \n' + JSON.stringify(fields))             
            console.log('files form: \n' + JSON.stringify(files))

			var publicacao = {}
			publicacao.data = new Date()
			publicacao.publico = fields.publico
			publicacao.hashtags = ["narracao"]


			var elemNarracao = {}
			elemNarracao.tipo = "narracao"
			var narracao = {}
			if (fields.titulo) {
				narracao.titulo = fields.titulo
			}
			narracao.texto = fields.texto
			if (fields.autor) {
				narracao.autor = fields.autor
			}
			elemNarracao.narracao = narracao
			publicacao.elems = []
			publicacao.elems.push(elemNarracao)
			
			if(Object.keys(files).length){
				parseFicheiros(fields, files)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
				})
			}
			else
				axiosPost(res, publicacao, fields)			
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA FICHEIROS"})
		}
    })
})

router.post("/lista", (req,res) => {
    var form = new formidable.IncomingForm()
    console.log("Post de /lista")
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")
            console.log('fields form: \n' + JSON.stringify(fields))             
            console.log('files form: \n' + JSON.stringify(files))
	
			var publicacao = {}
			publicacao.data = new Date()
			publicacao.publico = fields.publico
			publicacao.hashtags = ["lista"]
			publicacao.elems = []

			var listaElem = {}
			listaElem.tipo = "lista"
			listaElem.lista = {}
			listaElem.lista.titulo = fields.tituloLista
			listaElem.lista.itens = []

			var i = 1;
			var tag
			for (i = 1; i < Object.keys(fields).length - 3; i++){
				tag = "item"+i
				listaElem.lista.itens.push(fields[tag])
			}
			console.log("ESTA É A LISTA")
			console.dir(listaElem.lista.itens)
			publicacao.elems = [listaElem]

			if(Object.keys(files).length){
				parseFicheiros(fields, files)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
				})
			}
			else
				axiosPost(res, publicacao, fields)
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA FICHEIROS"})
		}
    })
})

////////////////////////////////////////////////////////
//////////////////////FUNCOES///////////////////////////
////////////////////////////////////////////////////////

async function parseFicheiros(fields, files){

    return new Promise((elemento, erro) =>{
		var ficheirosArray = []
        for(var fich in files){

            var fenviado = files[fich].path
            var fnovo = __dirname + '/../uploaded/'+fields.username+'/'+files[fich].name
            
            fs.rename(fenviado, fnovo, error => {
                
                if(error){
                    console.log('errou no rename: ' + error) 
                    erro(error)

                }
            })
            ficheirosArray.push(files[fich].name)
        }
        var elem = {}
        elem.tipo = "ficheiros"
        elem.ficheiros = {}
        elem.ficheiros.ficheiros = ficheirosArray
        if(fields.fileTitle)
            elem.ficheiros.titulo = fields.fileTitle

		elemento(elem)
    })
}

function axiosPost (res, publicacao, fields){

	console.log("-----------------------------------PUBLICAÇÃO-----------------------------------")
	console.log(JSON.stringify(publicacao))
	console.log("--------------------------------------------------------------------------------")

	axios.post("http://localhost:3000/api/pubs/pub", {pub: publicacao, username: fields.username})
	.then(dados =>{
		res.render("respostaPub", {pub : dados.data})
	})
	.catch(error =>{
		console.log("ERRO NA INSERÇÃO DA BASE DE DADOS: ", error)
	})
}


module.exports = router;