var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');

var Pub = require('./../../controllers/pubs')

router.get('/', (req, res) => {


	Pub.consultarFicheiro(req.query.idPub, req.query.idFich)
	.then(fich =>{

		console.log(JSON.stringify(fich))
		var ficheiro = fich[0].elems.ficheiros.ficheiros
		var parts = ficheiro.nome.split('.')
		var extention = "." + parts[parts.length - 1]
		var data = new Date(req.query.data)
		var dataCalendario = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();

		var filepath = __dirname + "/../../uploaded/" + req.query.username + "/" + dataCalendario + "/" + ficheiro.nomeGuardado + extention
		var resolvedFilepath = path.resolve(filepath)

		fs.stat(resolvedFilepath, (erro, _) =>{
			if(erro){
				console.log("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: ", erro)
				res.status(500).send("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: " + erro)
			}
			else
				res.sendFile(resolvedFilepath)
			
		})
	})
	.catch(erro =>{res.status(500).send("ERRO NA CONSULTA DO FICHEIRO NA BASE DE DADOS (files.js)" + erro)})
	
});

router.get('/download/', (req, res) => {

	var username = req.query.username
	var filename = req.query.filename

	var filepath = __dirname + "/../../uploaded/" + username + "/" + filename
	var resolvedFilepath = path.resolve(filepath)

	fs.stat(resolvedFilepath, (erro, status) =>{
		if(erro)
			console.log("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: ", erro)
		else{
			console.log("FICHEIRO EXISTENTE: ", status)
			res.download(resolvedFilepath)
		}
	})
});
module.exports = router;