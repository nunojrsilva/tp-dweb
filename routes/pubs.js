var express = require('express');
var router = express.Router();
var axios = require('axios')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path');
var hash = require('crypto').createHash;
var isImage = require('is-image')

var randomstring = require('randomstring')


router.get('/', function(req, res) {
	if(req.query.username && req.query.publico){
		axiosGet(req, res, 'http://localhost:3000/api/pubs?username=' + req.query.username + '&publico=' + req.query.publico)
        .then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', { pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else if(req.query.username){
		axiosGet(req, res, 'http://localhost:3000/api/pubs?username=' + req.query.username)
        .then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', { pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
    } else if(req.query.hashtag){
		axiosGet(req, res, 'http://localhost:3000/api/pubs?hashtag=' + req.query.hashtag)
		.then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', { pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else if(req.query.data){
		axiosGet(req, res, 'http://localhost:3000/api/pubs?data=' + req.query.data)
		.then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', { pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else{
		axiosGet(req, res, 'http://localhost:3000/api/pubs')
		.then(resposta =>{
			console.log(resposta)
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', { pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		// .catch(erro => {
		// 	console.log('Erro ao carregar da BD.' + erro)
		// 	//res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		// 	res.status(500).send(erro)
		//})
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
			publicacao.gostos = []

			var elem1 = {}
			elem1.tipo = "opiniao"
			elem1.opiniao = {}
			elem1.opiniao.opiniao = fields.opiniao
			publicacao.elems.push(elem1)

			if(Object.keys(files).length){
				
				parseFicheiros(fields, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao, fields)		
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
			publicacao.gostos = []

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
				parseFicheiros(fields, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})

			}
			else
				axiosPost(req, res, publicacao, fields)
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
			publicacao.gostos = []

			if(Object.keys(files).length){
				parseFicheiros(fields, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao, fields)
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
			publicacao.gostos = []


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
				parseFicheiros(fields, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao, fields)			
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
			publicacao.gostos = []

			var listaElem = {}
			listaElem.tipo = "lista"
			listaElem.lista = {}
			listaElem.lista.titulo = fields.titulo
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
				parseFicheiros(fields, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao, fields)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao, fields)
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA FICHEIROS"})
		}
    })
})

router.put('/comentario', function(req, res) {
	console.log('Entrei no put de comentários')
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")         
			console.log('Fields: \n' + JSON.stringify(fields))
			axiosPut(req, res, "http://localhost:3000/api/pubs/comentario", fields)
				.then(dados =>{
					res.render("comentario", {comentario : dados})
				})
				.catch(error =>{
					console.log("ERRO NO AXIOS PUT: " + error)
					res.status(500).send("ERRO NO AXIOS PUT" + error)
				})
		}
		else{
			res.status(500).send("ERRO AO FAZER PARSE DO FORM DA FICHEIROS" + erro)
		}
	})
});

router.put('/pubGostos', function(req, res) {
	console.log('Entrei no put de gostos')
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")         
			console.log('Fields: \n' + JSON.stringify(fields))
			axiosPut(req, res, "http://localhost:3000/api/pubs/pubGostos", {pubID: fields.pubID})
				.then(dados =>{
					res.send({size : dados})
				})
				.catch(error =>{
					console.log("ERRO NO AXIOS PUT GOSTOS: ", error)
					res.status(500).send("ERRO NO AXIOS PUT GOSTOS", error)
				})
		}
		else{
			res.status(500).send("ERRO AO FAZER PARSE DO FORM" + erro)
		}
	})
});

router.put('/comentGostos', function(req, res) {
	console.log('Entrei no put de gostos')
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")         
			console.log('Fields: \n' + JSON.stringify(fields))
			axiosPut(req, res, "http://localhost:3000/api/pubs/comentGostos", {comentID: fields.comentID})
				.then(dados =>{
					res.send({size : dados})
				})
				.catch(error =>{
					console.log("ERRO NO AXIOS PUT GOSTOS: ", error)
					res.status(500).send("ERRO NO AXIOS PUT GOSTOS", error)
				})
		}
		else{
			res.status(500).send("ERRO AO FAZER PARSE DO FORM" + erro)
		}
	})
});


////////////////////////////////////////////////////////
//////////////////////FUNCOES///////////////////////////
////////////////////////////////////////////////////////

async function parseFicheiros(fields, files, data){

    return new Promise((elemento, erro) =>{
		var ficheirosArray = []
		var ficheiro = {}
		var salt = null

        for(var fich in files){
			var nome = files[fich].name
			var parts = nome.split('.')
			var extention = "." + parts[parts.length - 1]
			
			var dataCalendario = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
			var pasta = path.resolve(__dirname + '/../uploaded/' + fields.username+'/' + dataCalendario)
			
			salt = randomstring.generate(64)

			ficheiro = {}
			ficheiro.nomeGuardado = hash('sha1').update(fields.username + nome + salt + dataCalendario).digest('hex')
			ficheiro.nome = nome
			ficheiro.isImage = isImage(nome)
			
			var fnovo =  pasta + '/' + ficheiro.nomeGuardado + extention
			console.log("EXTENSÃO", extention)
			var fenviado = files[fich].path

			//Verificação da existencia da pasta do dia (será que cria a do utilizador também?)
			if(!fs.existsSync(pasta)){
				fs.mkdirSync(pasta)
				console.log('PASTA DO DIA FOI CRIADA');				
			}

			fs.rename(fenviado, fnovo, error => {
				if(error){
					console.log('errou no rename: ' + error) 
					erro(error)
				}
			})
			ficheirosArray.push(ficheiro)
			

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



function axiosPut (req, res, url, data){
	return new Promise((info, erroAxios)=> {
		axios({
			method: 'put', //you can set what request you want to be
			url: url,
			data: data,
			headers: {
				Authorization: 'Bearer ' + req.session.token
			}
		})
		.then(dados =>{
			info(dados.data)
		})
		.catch(error =>{
			console.log("ERRO NO AXIOS PUT " +  error)
			erroAxios(error)
		})
	})
}

function axiosPost (req, res, publicacao, fields){

	console.log("-----------------------------------PUBLICAÇÃO-----------------------------------")
	console.log(JSON.stringify(publicacao))
	console.log("--------------------------------------------------------------------------------")

	axios({
		method: 'post', //you can set what request you want to be
		url: 'http://localhost:3000/api/pubs/pub',
		data:{
			pub: publicacao,
			username: fields.username
		},
		headers: {
			Authorization: 'Bearer ' + req.session.token
		}
  	})
	.then(dados =>{
		res.render("respostaPub", {pub : dados.data})
	})
	.catch(error =>{
		console.log("ERRO AXIOS POST: " + error)
	})
}

function axiosGet (req, res, url){
	console.log("Token no axios get " + req.session.token )

	return new Promise((dados, erroAxios) =>{

		axios({
			method: 'get', //you can set what request you want to be
			url: url,
			headers: {
				Authorization: 'Bearer ' + req.session.token
			}
		})
		.then(info =>{
			dados(info.data)
		})
		.catch(error =>{
			console.log("ERRO AXIOS GET: " + error)
			res.send("NAO TEM PERMISSOES")
			//erroAxios(error)
		})
	})

}

async function removeNomeGuardado(pubs){
	return new Promise((publicacoes) =>{

		for(pub in pubs){
			for (elem in pub.elems){
				if (elem.tipo == "ficheiros"){
					for (ficheiro in ficheiros){
						delete ficheiro[nomeGuardado]
					}
				}
			}
		}
		publicacoes(pubs)
	})
}

module.exports = router;