var express = require('express');
var router = express.Router();
var fs = require('fs')
var formidable = require('formidable')
var path = require('path');

router.get('/', (req, res) => {

	var username = req.query.username
	var filename = req.query.filename

	var filepath = __dirname + "/../../uploaded/" + username + "/" + filename
	var resolvedFilepath = path.resolve(filepath)

	fs.stat(resolvedFilepath, (erro, status) =>{
		if(erro)
			console.log("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: ", erro)
		else{
			console.log("FICHEIRO EXISTENTE: ", status)
			res.sendFile(resolvedFilepath)
		}
	})
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