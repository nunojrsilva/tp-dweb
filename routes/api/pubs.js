var express = require('express');
var router = express.Router();
var passport = require('passport')


var Pubs = require('../../controllers/pubs')
var User = require('../../controllers/users')


router.get('/', passport.authenticate('jwt', {session : false}), (req, res) => {
    console.log("Entrou no get de /pubs")

    console.log(req.user)

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
        console.log("CHEGUEI AQUI")
        try{
            Pubs.listar()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.send(erro))
        }
        catch(e){
            console.log(e)
            res.status(500).send('Erro na listagem de publicações' + e)
        }
    }
});

/////////////////////////////////////////////////////////
///////////////////POSTS/////////////////////////////////
/////////////////////////////////////////////////////////

router.post('/pub', passport.authenticate('jwt', {session : false}), (req, res) =>{
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

router.put('/comentario', passport.authenticate('jwt', {session : false}), (req, res) =>{
    console.log("PASSEI PELO /api/comentario")
    console.dir(req.body)
    User.consultarUsername(req.body.username)
        .then(username =>{
            if(username != null){
                var comentario = {}
                comentario.utilizador = username
                comentario.texto = req.body.comentario
                comentario.gostos = []
            
                Pubs.inserirComentario(req.body.pubID, comentario)
                    .then(pub => {
                        var novoComentario = pub.comentarios[pub.comentarios.length - 1]
                        console.log("COMENTÁRIO SUBMETIDO COM SUCESSO", novoComentario)
                        res.jsonp(novoComentario)
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

router.put('/pubGostos', passport.authenticate('jwt', {session : false}), (req, res) =>{
    console.log("PASSEI PELO /api/pubGostos")
    console.dir(req.body)
    User.consultarUsername("ricardo15")
    .then(username =>{
        if(username != null){
            username = username._id
            Pubs.contaPubGostos(req.body.pubID)
            .then(gostos => {
                console.log(gostos[0])
                var nGostos = gostos[0].gostos
                console.log("Número de gostos: " + nGostos)
                
                Pubs.consultarUserPubGosto(req.body.pubID, username)
                .then( dados => {
                    console.log("Consultar User Pub Gosto Res: ", dados.length)
                    if(dados.length == 0){
                        console.log("User gostou da pub")
                        Pubs.pubIncGostos(req.body.pubID, username)
                        .then(pub => {
                            console.log("GOSTO ADICIONADO COM SUCESSO", pub)
                            res.jsonp(nGostos+1)
                        })
                        .catch(erro => {
                            console.log('Errei no incrementar gosto\n' + erro)
                            res.status(500).send('Erro na incrementação de gostos: ' + erro)
                        })
                    }
                    else{
                        console.log("User não gostou da pub")
                        Pubs.pubDecGostos(req.body.pubID, username)
                        .then(pub => {
                            console.log("GOSTO RETIRADO COM SUCESSO", pub)
                            res.jsonp(nGostos-1)
                        })
                        .catch(erro => {
                            console.log('Errei no decrementar gosto\n' + erro)
                            res.status(500).send('Erro na decrementação de gostos: ' + erro)
                        })
                    }
                })
                .catch( erroGostos => {
                    console.log("ERRO AO CONSULTAR USER GOSTO: ", erroGostos)
                    res.status(500).send("ERRO AO CONSULTAR USER GOSTO: " + erroGostos)
                })
            })
            .catch(erroContaGostos => {
                console.log('Errei no contar gostos\n' + erroContaGostos)
                res.status(500).send('Erro no contar gostos: ' + erroContaGostos)
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

router.put('/comentGostos', passport.authenticate('jwt', {session : false}), (req, res) =>{
    console.log("PASSEI PELO /api/comentGostos")
    console.dir(req.body)
    User.consultarUsername("ricardo15")
    .then(username =>{
        if(username != null){
            username = username._id
            Pubs.contaComentGostos(req.body.comentID)
            .then(gostos => {
                console.log(gostos[0])
                var nGostos = gostos[0].gostos
                console.log("Número de gostos: " + nGostos)

                Pubs.consultarUserComentGosto(req.body.comentID, username)
                .then( dados => {
                    console.log("Consultar User Coment Gosto Res: ", dados.length)
                    if(dados.length == 0){
                        console.log("User gostou do comentário")
                        Pubs.comentIncGostos(req.body.comentID, username)
                        .then(pub => {
                            console.log("GOSTO ADICIONADO COM SUCESSO", pub)
                            res.jsonp(nGostos+1)
                        })
                        .catch(erro => {
                            console.log('Errei no incrementar gosto\n' + erro)
                            res.status(500).send('Erro na incrementação de gostos: ' + erro)
                        })
                    }
                    else{
                        console.log("User não gostou do comentário")
                        Pubs.comentDecGostos(req.body.comentID, username)
                        .then(pub => {
                            console.log("GOSTO RETIRADO COM SUCESSO", pub)
                            res.jsonp(nGostos-1)
                        })
                        .catch(erro => {
                            console.log('Errei no decrementar gosto\n' + erro)
                            res.status(500).send('Erro na decrementação de gostos: ' + erro)
                        })
                    }
                })
                .catch( erroGostos => {
                    console.log("ERRO AO CONSULTAR USER GOSTO: ", erroGostos)
                    res.status(500).send("ERRO AO CONSULTAR USER GOSTO: " + erroGostos)
                })
            })
            .catch(erroContaGostos => {
                console.log('Errei no contar gostos\n' + erroContaGostos)
                res.status(500).send('Erro no contar gostos: ' + erroContaGostos)
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

/////////////////////////////////////////////////////////
///////////////////DELETES///////////////////////////////
/////////////////////////////////////////////////////////

router.delete('/:pid', passport.authenticate('jwt', {session : false}), (req,res) => {
    Pubs.remover(req.params.pid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro ao apagar publicação ' + req.params.pid))
})

/////////////////////////////////////////////////////////
///////////////////FUNCOES///////////////////////////////
/////////////////////////////////////////////////////////

module.exports = router;