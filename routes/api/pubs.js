var express = require('express');
var router = express.Router();
var fs = require('fs')
var formidable = require('formidable')


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


/*
router.get('/tipo/:t', (req, res) => {
	Pubs.listarTipo(req.params.t)
		.then(dados => res.jsonp(dados))
		.catch(erro => res.status(500).send('Erro na listagem de publicações por tipo: ' + erro))
});*/


/////////////////////////////////////////////////////////
///////////////////POSTS/////////////////////////////////
/////////////////////////////////////////////////////////

router.post("/lista", (req,res) => {
    var form = new formidable.IncomingForm()
    console.log("Post de /lista")
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")
            console.log('fields form: \n' + JSON.stringify(fields))             
            console.log('files form: \n' + JSON.stringify(files))
            User.consultarUsername(fields.username)
                .then(un => {            
                    
                    var publicacao = {}
                    publicacao.utilizador = un
                    publicacao.data = new Date()
                    publicacao.publico = fields.publico
                    publicacao.hashtags = ["lista"]
                    publicacao.elems = []

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

                    console.dir(listaElem.lista.itens)
                    publicacao.elems = [listaElem]

                    ficheirosArray = []

                    if(Object.keys(files).length) {

                        for(var fich in files){

                            var fenviado = files[fich].path
                            var fnovo = __dirname + '/../../uploaded/'+fields.username+'/'+files[fich].name
                            
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
                        var elemFicheiro = {}
                        elemFicheiro.ficheiros = {}
                        elemFicheiro.tipo = "ficheiro"
                        elemFicheiro.ficheiros.ficheiros = ficheirosArray

                        publicacao.elems.push(elemFicheiro)
                        
                    }
                    console.log("PUB")                    
                    console.dir(publicacao)
                    Pubs.inserir(publicacao)
                        .then(dados => {
                            console.log('entrei no then do inserir publicação\n' + JSON.stringify(dados))   
                            User.inserirPub(publicacao.utilizador, dados._id)
                                .then(user => {
                                    console.log("PUBLICAÇÃO SUBMETIDA COM SUCESSO", user)
                                    res.render("respostaPub", {pub : dados})
                                    //res.end()
                                })
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
    }
)

router.post("/narracao", (req,res) => {
    var form = new formidable.IncomingForm()
    console.log("Post de /narracao")
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log("Passei o parse")
            console.log('fields form: \n' + JSON.stringify(fields))             
            console.log('files form: \n' + JSON.stringify(files))
            User.consultarUsername(fields.username)
                .then(un => {            
                    var publicacao = {}
                    publicacao.utilizador = un
                    publicacao.data = new Date()
                    publicacao.publico = fields.publico
                    publicacao.hashtags = ["narracao"]
                    console.log('Cheguei ao 1') 


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
                    console.log('Cheguei ao 2') 
                    elemNarracao.narracao = narracao
                    publicacao.elems = []
                    publicacao.elems.push(elemNarracao)
                    console.log('Cheguei ao 3') 
                    
                    ficheirosArray = []

                    console.log('Cheguei ao 4') 
                    if(Object.keys(files).length) {

                        for(var fich in files){

                            var fenviado = files[fich].path
                            var fnovo = __dirname + '/../../uploaded/'+fields.username+'/'+files[fich].name
                            
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
                        var elemFicheiro = {}
                        elemFicheiro.ficheiros = {}
                        elemFicheiro.tipo = "ficheiro"
                        elemFicheiro.ficheiros.ficheiros = ficheirosArray

                        publicacao.elems.push(elemFicheiro)
                        
                    }
                    
                    Pubs.inserir(publicacao)
                        .then(dados => {
                            console.log('entrei no then do inserir publicação\n' + JSON.stringify(dados))   
                            User.inserirPub(publicacao.utilizador, dados._id)
                                .then(user => {
                                    console.log("PUBLICAÇÃO SUBMETIDA COM SUCESSO", user)
                                    res.render("respostaPub", {pub : dados})
                                })
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
    }
)

router.post('/ficheiros', (req, res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            console.log('fields: \n' + JSON.stringify(fields))             
            console.log('files: \n' + JSON.stringify(files))
            User.consultarUsername(fields.username)
                .then(un => {    
                    var publicacao = {}
                    publicacao.utilizador = un
                    publicacao.hashtags = ["ficheiros"]
                    publicacao.data = new Date()
                    publicacao.publico = fields.publico
                    publicacao.elems = []

                    ficheirosArray = []

                    for(var fich in files){

                        var fenviado = files[fich].path
                        var fnovo = __dirname + '/../../uploaded/'+fields.username+'/'+files[fich].name
                        
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
                    elem.tipo = "ficheiros"
                    elem.ficheiros = {}
                    if(fields.fTitulo)
                        elem.ficheiros.titulo = fields.fTitulo
                    elem.ficheiros.ficheiros = ficheirosArray
                    publicacao.elems.push(elem)
                    
                    Pubs.inserir(publicacao)
                        .then(dados => {
                            console.log('entrei no then do inserir publicação\n' + JSON.stringify(dados))   
                            User.inserirPub(publicacao.utilizador, dados._id)
                                .then(user => {
                                    console.log("PUBLICAÇÃO SUBMETIDA COM SUCESSO", user)
                                    res.render("respostaPub", {pub : dados})
                                })
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



router.post('/opiniao', (req, res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
		if(!erro){
            User.consultarUsername(fields.username)
                .then(un => {     
                    console.log('fields: \n' + JSON.stringify(fields))             
                    console.log('files: \n' + JSON.stringify(files))       
                    var publicacao = {}
                    publicacao.utilizador = un
                    publicacao.hashtags = ["War", "Terror"]
                    publicacao.data = new Date()
                    publicacao.publico = fields.publico
                    publicacao.elems = []
                    var elem1 = {}
                    elem1.tipo = "opiniao"
                    elem1.opiniao = {}
                    elem1.opiniao.opiniao = fields.opiniao
                    publicacao.elems.push(elem1)

                    ficheirosArray = []

                    for(var fich in files){

                        var fenviado = files[fich].path
                        var fnovo = __dirname + '/../../uploaded/'+fields.username+'/'+files[fich].name
                        
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
                    var elem2 = {}
                    elem2.tipo = "ficheiros"
                    elem2.ficheiros = {}
                    elem2.ficheiros.ficheiros = ficheirosArray
                    publicacao.elems.push(elem2)
                    console.log("-----------------------------------PUBLICAÇÃO-----------------------------------")
                    console.log(JSON.stringify(publicacao))
                    console.log("--------------------------------------------------------------------------------")

                    //PUB CRIADA
                    Pubs.inserir(publicacao)
                        .then(dados => {
                            console.log('entrei no then do inserir publicação\n' + JSON.stringify(dados))   
                            User.inserirPub(publicacao.utilizador, dados._id)
                                .then(user => {
                                    console.log("PUBLICAÇÃO SUBMETIDA COM SUCESSO", user)
                                    res.render("respostaPub", {pub : dados})
                                })
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

router.post('/evento', (req, res) => {
    
    var form = new formidable.IncomingForm()

    form.parse(req, (erro, fields, files)=>{
        
        if(!erro){
            
            User.consultarUsername(fields.username)
                .then(un => {     
                    
                    console.log('fields: \n' + JSON.stringify(fields))             
                    console.log('files: \n' + JSON.stringify(files))       
                    
                    var publicacao = {}
                    publicacao.utilizador = un
                    console.log('Cheguei ao 1')  
                    publicacao.hashtags = ["Evento"]
                    console.log('Cheguei ao 2')  
                    publicacao.data = new Date()
                    console.log("ISTO È A PRIVACIDADE", fields.publico)
                    publicacao.publico = fields.publico
                    publicacao.elems = []
                    console.log('Cheguei ao 3')  
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

                    console.log('Cheguei ao 4')  

                    ficheirosArray = []
                    console.log("AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", )
                    console.dir(files)
                    if(Object.keys(files).length){
                        for(var fich in files){

                            var fenviado = files[fich].path
                            var fnovo = __dirname + '/../../uploaded/'+fields.username+'/'+files[fich].name
                            
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
                        var elem2 = {}
                        elem2.tipo = "ficheiros"
                        elem2.ficheiros = {}
                        elem2.ficheiros.ficheiros = ficheirosArray
                        if(fields.fileTitle)
                            elem2.ficheiros.titulo = fields.fileTitle

                        publicacao.elems.push(elem2)
                    }
                    console.log("-----------------------------------PUBLICAÇÃO-----------------------------------")
                    console.log(JSON.stringify(publicacao))
                    console.log("--------------------------------------------------------------------------------")
                    Pubs.inserir(publicacao)
                        .then(dados => {
                            //console.log('entrei no then do inserir publicação\n' + JSON.stringify(dados))   
                            User.inserirPub(publicacao.utilizador, dados._id)
                                .then(user => {
                                    console.log("PUBLICAÇÃO SUBMETIDA COM SUCESSO", user)
                                    res.render("respostaPub", {pub : dados})
                                })
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
			res.status(500)
            res.render('error', {message: "Erro no Parse", error: erro})
			console.log('errou no parse: ' + erro)
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

    var promise = new Promise( (resolve, reject) => {
        // do a thing, possibly async, then…
        console.log("No inicio do completaPubLista, " + JSON.stringify(ObjLista))
        User.consultarUsername(ObjLista.username)
            .then(un => {
                var novaLista = {}
                novaLista.utilizador = un._id
                novaLista.data = new Date()
                novaLista.hashtags = ["Lista"]
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
    var lista = {}
    Elem.tipo = "lista"
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
