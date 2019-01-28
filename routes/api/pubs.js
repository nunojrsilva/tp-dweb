var express = require('express');
var router = express.Router();
var passport = require('passport')
var axios = require('axios')

var flash = require('connect-flash');


var Pubs = require('../../controllers/pubs')
var User = require('../../controllers/users')


router.get('/', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) => {
    console.log("Entrou no get de /pubs")

    console.log(req.user)

	if(req.query.username && req.query.privacidade){
        User.consultarUsername(req.query.username)
            .then(uid => {
                Pubs.listarPorUserPrivacidade(uid, req.query.privacidade)
                    .then(dados => res.jsonp(dados))
                    .catch(erro => res.status(500).send('Erro na consulta de publicações do autor: ' + req.query.username + ' -> Público: ' + req.query.privacidade))
            })  
            .catch(erro =>  console.log("Erro no consultarUsername da listarPorUserPrivacidade ") + erro)
    } else if(req.query.privacidade){
        Pubs.listarPorPrivacidade(req.query.privacidade)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send('Erro na consulta de publicações publicas: '))

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
            User.getASeguir(req.user._id)
            .then(aSeguirArray =>{
                var aSeguirObj = aSeguirArray[0]
                console.log(aSeguirObj)
                Pubs.listarPubsCompleta(req.user._id, aSeguirObj.aSeguir)
                .then(dados =>{ 
                    console.log("E ISTO QUE QUERO VER")
                    console.log(JSON.stringify(dados))        
                    res.jsonp(dados)
                })
                .catch(erro => res.send(erro))
            })
            .catch()
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

router.post('/pub', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
    console.log("PASSEI PELO /PUB")
    console.dir(req.body)
    Pubs.inserir(req.body.pub)
    .then(dados => {
        User.inserirPub(req.user._id, dados._id)
        .then(user => {
            Pubs.consultar(dados._id)
            .then(pub => {
                res.jsonp(pub)
            })
            .catch(erro3 => {
                console.log('Errei no consultar publicação do create\n' + erro3)
                res.status(500).send('Errei no consultar publicação do create: ' + erro3)
            })
        })
        .catch(erro2 => {
            console.log('Errei no consultar utilizador do create publicação\n' + erro2)
            res.status(500).send('Errei no consultar utilizador do create publicação: ' + erro2)
        })
    })
    .catch(erro => {
        console.log('Errei no inserir publicação\n' + erro)
        res.status(500).send('Errei na inserção de publicações: ' + erro)
    })
})

/////////////////////////////////////////////////////////
/////////////////////////PUTS////////////////////////////
/////////////////////////////////////////////////////////

router.put('/comentario', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
    console.log("PASSEI PELO /api/comentario")
    console.dir(req.body)
    console.dir("REQ USER: " + JSON.stringify(req.user))

    var comentario = {}
    comentario.utilizador = req.user._id
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
})

router.put('/pubGostos', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
    console.log("PASSEI PELO /api/pubGostos")
    console.dir(req.body)

    Pubs.contaPubGostos(req.body.pubID)
    .then(gostos => {
        console.log(gostos[0])
        var nGostos = gostos[0].gostos
        console.log("Número de gostos: " + nGostos)
                
        Pubs.consultarUserPubGosto(req.body.pubID, req.user._id)
        .then( dados => {
            console.log("Consultar User Pub Gosto Res: ", dados.length)
            if(dados.length == 0){
                console.log("User gostou da pub")
                Pubs.pubIncGostos(req.body.pubID, req.user._id)
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
                Pubs.pubDecGostos(req.body.pubID, req.user._id)
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
})

router.put('/comentGostos', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req, res) =>{
    console.log("PASSEI PELO /api/comentGostos")
    console.dir(req.body)
    Pubs.contaComentGostos(req.body.comentID)
    .then(gostos => {
        console.log(gostos[0])
        var nGostos = gostos[0].gostos
        console.log("Número de gostos: " + nGostos)

        Pubs.consultarUserComentGosto(req.body.comentID, req.user._id)
        .then( dados => {
            console.log("Consultar User Coment Gosto Res: ", dados.length)
            if(dados.length == 0){
                console.log("User gostou do comentário")
                Pubs.comentIncGostos(req.body.comentID, req.user._id)
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
                Pubs.comentDecGostos(req.body.comentID, req.user._id)
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
})

/////////////////////////////////////////////////////////
///////////////////DELETES///////////////////////////////
/////////////////////////////////////////////////////////

router.delete('/:pid', passport.authenticate('jwt', {session : false, failureRedirect : "/publicas", failureFlash : "Não tem acesso a esta página, por favor autentique-se!"}), (req,res) => {
    Pubs.remover(req.params.pid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro ao apagar publicação ' + req.params.pid))
})

/////////////////////////////////////////////////////////
///////////////////FUNCOES///////////////////////////////
/////////////////////////////////////////////////////////
module.exports = router;