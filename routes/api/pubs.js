var express = require('express');
var router = express.Router();
var fs = require('fs')
var formidable = require('formidable')
var isImage = require('is-image')


var Pubs = require('../../controllers/pubs')
var User = require('../../controllers/users')


router.get('/', (req, res) => {
    console.log("Entrou no get de /pubs")
	if(req.query.username && req.query.publico){
        User.consultarUsername(req.query.username)
            .then(uid => {
                Pubs.listarPorUserPublico(uid, req.query.publico)
                    .then(dados => res.jsonp(dados))
                    .catch(erro => res.status(500).send('Erro na consulta de publicações do autor: ' + req.query.username + ' -> Público: ' + req.query.publico))
            })  
            .catch(erro =>  console.log("Erro no consultarUsername da listarPorUserPublico"))

    } else if(req.query.username){
        User.consultarUsername(req.query.username)
            .then(uid => {
                Pubs.listarPorUser(uid)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).send('Erro na consulta de publicações do autor: ' + req.query.autor))
            })  
            .catch(erro =>  console.log("Erro no consultarUsername da listarPorUser"))
	} else if(req.query.hashtag){
		Pubs.listarPorHashtag(req.query.hashtag)
			.then(dados => res.jsonp(dados))
			.catch(erro => res.status(500).send('Erro na consulta de publicações com a hashtag: ' + req.query.hashtag))
	}else if(req.query.data){
		Pubs.listarPorData(req.query.data)
			.then(dados => res.jsonp(dados))
			.catch(erro => res.status(500).send('Erro na listagem por data: ' + erro))
	} else{
        Pubs.listar()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na listagem de publicações'))
    }
});

/////////////////////////////////////////////////////////
///////////////////POSTS/////////////////////////////////
/////////////////////////////////////////////////////////

router.post('/pub', (req, res) =>{
    console.log("PASSEI PELO /PUB")
    console.dir(req.body)

    User.consultarUsername(req.body.username)
    .then(username =>{
        req.body.pub.utilizador = username
        Pubs.inserir(req.body.pub)
            .then(dados => {
                User.inserirPub(username, dados._id)
                    .then(user => {
                        console.log("PUBLICAÇÃO SUBMETIDA COM SUCESSO", user)
                        res.jsonp(dados)
                    })
            })
            .catch(erro => {
                console.log('Errei no inserir publicação\n' + erro)
                res.status(500).send('2 na inserção de publicações: ' + erro)
            })
    })
    .catch(erroUsername =>{
        console.log("ERRO AO CONSULTAR O USERNAME: ", erroUsername)
        res.status(500).send("ERRO AO CONSULTAR O USERNAME: " + erroUsername)
    })

})

router.put('/comentario', (req, res) =>{
    console.log("PASSEI PELO /api/comentario")
    console.dir(req.body)
    User.consultarUsername(req.body.username)
        .then(username =>{
            if(username != null){
                var comentario = {}
                comentario.utilizador = username
                comentario.texto = req.body.comentario
                comentario.gostos = 0;
            
                Pubs.inserirComentario(req.body.pubID, comentario)
                    .then(pub => {
                        console.log("PUBLICAÇÃO SUBMETIDA COM SUCESSO", pub)
                        res.jsonp(pub)
                    })
                    .catch(erro => {
                        console.log('Errei no inserir comentário\n' + erro)
                        res.status(500).send('Erro na inserção de comentários: ' + erro)
                    })
            }
            else{
                console.log('Utilizador inexistente\n' + erro)
                res.status(500).send('Utilizador inexistente: ' + erro)
            }
        })
        .catch(erroUsername =>{
            console.log("ERRO AO CONSULTAR O USERNAME: ", erroUsername)
            res.status(500).send("ERRO AO CONSULTAR O USERNAME: " + erroUsername)
        })
})

router.put('/pubGostos', (req, res) =>{
    console.log("PASSEI PELO /api/pubGostos")
    console.dir(req.body)
    Pubs.pubIncGostos(req.body.pubID)
        .then(pub => {
            console.log("GOSTO FEITO COM SUCESSO", pub)
            res.jsonp(pub)
        })
        .catch(erro => {
            console.log('Errei no incrementar gosto\n' + erro)
            res.status(500).send('Erro na incrementação de gostos: ' + erro)
        })
})

router.put('/comentGostos', (req, res) =>{
    console.log("PASSEI PELO /api/comentGostos")
    console.dir(req.body)
    Pubs.comentIncGostos(req.body.comentID)
        .then(pub => {
            console.log("GOSTO FEITO COM SUCESSO", pub)
            res.jsonp(pub)
        })
        .catch(erro => {
            console.log('Errei no incrementar gosto\n' + erro)
            res.status(500).send('Erro na incrementação de gostos: ' + erro)
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

module.exports = router;