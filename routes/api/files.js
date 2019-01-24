var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path');
var hash = require('crypto').createHash;


router.get('/', (req, res) => {

	var username = req.query.username
	var data = new Date(req.query.data)
	var dataCalendario = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
	var filename = req.query.filename
	var filenameHash = hash('sha1').update(username + filename + dataCalendario).digest('hex')

	var parts = filename.split('.')
	var extention = "." + parts[parts.length - 1]

	var filepath = __dirname + "/../../uploaded/" + username + "/" + dataCalendario + "/" + filenameHash + extention
	var resolvedFilepath = path.resolve(filepath)

	fs.stat(resolvedFilepath, (erro, _) =>{
		if(erro){
			console.log("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: ", erro)
			res.status(500).send("FICHEIRO QUE PRETENDE NÃO SE ENCONTRA DISPONÍVEL: " + erro)
		}
		else
			res.sendFile(resolvedFilepath)
		
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