var express = require('express');
var router = express.Router();
var axios = require('axios')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path');
var hash = require('crypto').createHash;
var isImage = require('is-image')
var passport = require('passport')

var randomstring = require('randomstring')


router.get('/', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) => {
	if(req.query.username && req.query.privacidade){
		axiosGet(req, res, 'http://localhost:3000/api/pubs?username=' + req.query.username + '&privacidade=' + req.query.privacidade)
        .then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', { loggedIn : true, pubs: publicacoes }))
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
			.then(publicacoes => res.render('listaPubs', { loggedIn : true, pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
    } else if(req.query.privacidade){
		axiosGet(req, res, 'http://localhost:3000/api/pubs?privacidade=' + req.query.privacidade)
		.then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs',{ loggedIn : true, pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
    } else if(req.query.hashtag){
		console.log("Hashtag = " + req.query.hashtag)
		axiosGet(req, res, 'http://localhost:3000/api/pubs?hashtag=' + req.query.hashtag)
		.then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('pubHashtag', { loggedIn : true, pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao obter pubs com hashtags"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.' + erro)
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else if(req.query.data){
		axiosGet(req, res, 'http://localhost:3000/api/pubs?data=' + req.query.data)
		.then(resposta =>{
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('pubHashtag', { loggedIn : true, pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		.catch(erro => {
			console.log('Erro ao carregar da BD.')
			res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		})
	} else{
		axiosGet(req, res, 'http://localhost:3000/api/pubs')
		.then(resposta =>{
			console.log("TENHO QUE FAZER RENDER A ISTO")
			console.log(resposta)
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', { loggedIn : true, pubs: publicacoes }))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
		// .catch(erro => {
		// 	console.log('Erro ao carregar da BD.' + erro)
		// 	//res.render('error', {e: erro, message: "Erro ao carregar da BD"})
		// 	res.status(500).send(erro)
		//})
	}
});


router.get('/publicas', (req,res) => {
	axiosGet(req, res, 'http://localhost:3000/api/pubs/publicas')
		.then(resposta =>{
			console.log(resposta)
			removeNomeGuardado(resposta)
			.then(publicacoes => res.render('listaPubs', {pubs: publicacoes}))
			.catch(fail => res.render('error', {e: fail, message: "Erro ao eliminar campos das publicações"}))
		})
})

router.get('/novalista', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}),(req,res) => {
    console.log("Entrou no get de /pubs/lista")
    res.render("lista")
})


router.get('/novaPubFich', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}),function(req, res) {
	res.render('ficheirosReg')
});

router.get('/novoEvento', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}),(req, res) => {
	res.render('evento')
});

router.get("/narracao", passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req,res) => {
	res.render("narracao")
})
router.get('/opiniao', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}),function(req, res) {
	res.render('opiniao')
});

router.get('/opiniaoPub', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}),(req,res) => {
    res.render("opiniaoPub")
})

router.get('/narracaoPub', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}),(req,res) => {
    res.render("narracaoPub")
})

router.get('/ficheirosPub', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}),(req,res) => {
    res.render("ficheirosPub")
})

router.get('/listaPub',  passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req,res) => {
    res.render("listaPub")
})

router.get('/eventoPub',  passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req,res) => {
    res.render("eventoPub")
})

router.get('/publicar',   passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), function(req, res) {
	res.render('publicar')
});

////////////////////////////////////////////////////////
//////////////////////POSTS/////////////////////////////
////////////////////////////////////////////////////////

router.post('/alterarPrivacidade', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
	if(req.body.idPub != undefined && req.body.priv != undefined){
		console.log("CHEGUEI AQUI")
		axios({
			method: 'post', 
			
			url: 'http://localhost:3000/api/pubs/alterarPrivacidade',
			data:{
				idPub: req.body.idPub,
				priv: req.body.priv
			},
			headers: {
				Authorization: 'Bearer ' + req.session.token
			}
		  })
		.then(dados =>{
			console.log("respostaPub: \n" + JSON.stringify(dados.data))
			res.jsonp(dados.data.privacidade)
		})
		.catch(error =>{
			console.log("ERRO AO TENTAR MUDAR A PRIVACIDADE DE UMA PUBLICAÇÃO: " + error)
			res.status(500).send("ERRO AO TENTAR MUDAR A PRIVACIDADE DE UMA PUBLICAÇÃO: " + error)
		})
	}
})

router.post('/opiniao', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
	
	var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
		
			console.log('fields: \n' + JSON.stringify(fields))             
			console.log('files: \n' + JSON.stringify(files))       
			var publicacao = {}
			publicacao.utilizador = req.user._id
			var data = new Date()
			publicacao.data = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
			publicacao.hashtags = separa(fields.hashtags)
			publicacao.privacidade = fields.privacidade
			publicacao.elems = []
			publicacao.gostos = []

			var elem1 = {}
			elem1.tipo = "opiniao"
			elem1.opiniao = {}
			elem1.opiniao.opiniao = fields.opiniao
			publicacao.elems.push(elem1)

			if(Object.keys(files).length){
				
				parseFicheiros(req.user.username, fields.fileTitle, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao)		
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA OPINIAO"})
		}
    })
});

router.post('/evento', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
    
    var form = new formidable.IncomingForm()

    form.parse(req, (erro, fields, files)=>{
        
        if(!erro){

			console.log('fields: \n' + JSON.stringify(fields))             
			console.log('files: \n' + JSON.stringify(files))       
			
			var publicacao = {}
			publicacao.utilizador = req.user._id
			var data = new Date()
			publicacao.data = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
			publicacao.hashtags = separa(fields.hashtags)
			publicacao.local = fields.local
			publicacao.privacidade = fields.privacidade
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
				parseFicheiros(req.user.username, fields.fileTitle, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})

			}
			else
				axiosPost(req, res, publicacao)
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA EVENTO"})
		}	
	})
});

router.post('/ficheiros', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{

    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log('fields: \n' + JSON.stringify(fields))             
            console.log('files: \n' + JSON.stringify(files))

			var publicacao = {}
			publicacao.utilizador = req.user._id
			var data = new Date()
			publicacao.data = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
			publicacao.hashtags = separaHashtag(fields.hashtags)
			publicacao.privacidade = fields.privacidade
			publicacao.elems = []
			publicacao.gostos = []

			if(Object.keys(files).length){
				parseFicheiros(req.user.username, fields.fileTitle, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao)
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA FICHEIROS"})
		}
	})	
		
});

router.post("/narracao", passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
    var form = new formidable.IncomingForm()
    console.log("Post de /narracao")
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")
            console.log('fields form: \n' + JSON.stringify(fields))             
            console.log('files form: \n' + JSON.stringify(files))

			var publicacao = {}
			publicacao.utilizador = req.user._id
			var data = new Date()
			publicacao.data = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
			publicacao.privacidade = fields.privacidade
			publicacao.hashtags = separa(fields.hashtags)
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
				parseFicheiros(req.user.username, fields.fileTitle, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao)			
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA FICHEIROS"})
		}
    })
})

router.post("/lista", passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
    var form = new formidable.IncomingForm()
    console.log("Post de /lista")
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")
            console.log('fields form: \n' + JSON.stringify(fields))             
            console.log('files form: \n' + JSON.stringify(files))
	
			var publicacao = {}
			publicacao.utilizador = req.user._id
			var data = new Date()
			publicacao.data = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
			publicacao.privacidade = fields.privacidade
			publicacao.hashtags = separa(fields.hashtags)
			publicacao.elems = []
			publicacao.gostos = []

			var listaElem = {}
			listaElem.tipo = "lista"
			listaElem.lista = {}
			listaElem.lista.titulo = fields.titulo
			listaElem.lista.itens = []

			var i = 1;
			var tag
			for (i = 1; i <= Object.keys(fields).length - 3; i++){
				tag = "item"+i
				listaElem.lista.itens.push(fields[tag])
			}
			console.log("ESTA É A LISTA")
			console.dir(listaElem.lista.itens)
			publicacao.elems = [listaElem]

			if(Object.keys(files).length){
				parseFicheiros(req.user.username, fields.fileTitle, files, publicacao.data)
				.then(elemFicheiro => {
					publicacao.elems.push(elemFicheiro)
					axiosPost(req, res, publicacao)
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO " + erro)
				})
			}
			else
				axiosPost(req, res, publicacao)
		}
		else{
			res.render('error', {error: erro, message: "ERRO AO FAZER PARSE DO FORM DA FICHEIROS"})
		}
    })
})

router.put('/comentario', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
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

router.put('/pubGostos', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
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

router.put('/comentGostos', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
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

async function parseFicheiros(username, fileTitle, files, data_DADA){

    return new Promise((elemento, erro) =>{
		var ficheirosArray = []
		var ficheiro = {}
		var salt = null

        for(var fich in files){
			var nome = files[fich].name
			var parts = nome.split('.')
			var extention = "." + parts[parts.length - 1]
			
			var pasta = path.resolve(__dirname + '/../uploaded/' + username+'/' + data_DADA)
			
			salt = randomstring.generate(64)

			ficheiro = {}
			ficheiro.nomeGuardado = hash('sha1').update(username + nome + salt + data_DADA).digest('hex')
			ficheiro.nome = nome
			ficheiro.isImage = isImage(nome).toString()
			
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
        if(fileTitle)
            elem.ficheiros.titulo = fileTitle

		elemento(elem)
    })
}


function separa (ListaHash) {
	Lista = ListaHash.split("#")
	console.log(Lista)
	for(i=0; i < Lista.length; i++) {
		if (Lista[i].length == 0 || Lista[i] == ' ')
			Lista.splice(i,1)
		Lista[i].trim()
	}
	return Lista
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
			res.render("semPermissao")
			//erroAxios(error)
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
			pub: publicacao
		},
		headers: {
			Authorization: 'Bearer ' + req.session.token
		}
  	})
	.then(dados =>{
		console.log("respostaPub: \n" + JSON.stringify(dados.data))
		res.render("respostaPub", {pub : dados.data})
	})
	.catch(error =>{
		console.log("ERRO AXIOS POST: " + error)
		res.render("semPermissao")
		//erroAxios(error)
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
			res.render("semPermissao")
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