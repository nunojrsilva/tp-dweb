var express = require('express');
var router = express.Router();
let fs = require('fs');
var hash = require('crypto').createHash;

var User = require('../../controllers/users')


router.get('/', (req,res) => {
    console.log("Entrou no get de /users")
    User.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na listagem de utilizadores' + erro))
})

/*  ATENÇÃO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
    ESTE POST VAI FAZER UM RES.RENDER MAS SE FOR PARA FAZER UM /USERS PASSA A JSONP 
    E O RES.RENDER PASSA PARA ESSE FICHEIRO
    */
router.get('/verFotoPerfil', (req, res)=>{
    console.log("Entrou no get de /users/verFotoPerfil")
    User.consultarUsername(req.query.username)
    .then(id =>{
        User.obterFotosPerfil(id._id)
        .then(fotosArray => {
            var fotosObj = fotosArray[0]
            fotosObj.userid = id._id
            res.render('fotosPerfil', {fotos: fotosObj})
        })
        .catch(erroFotos => res.status(500).send('Erro na listagem de fotos de um utilizador' + erroFotos))
    })
    .catch(erroUsername => res.status(500).send('Erro na consulta de utilizadores' + erroUsername))
   
})

router.get('/:uid', (req,res) => {
    User.consultar(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send('Erro na consulta do Utilizador ' + erro + req.params.uid))
})

router.post('/', (req,res) => {
    var utilizador = req.body
    console.log('Entrei no post de users', utilizador)
    var fotoPerfil = {}
    fotoPerfil.idAtual = null
    fotoPerfil.fotos = []

    var fotoDefault = {}
    fotoDefault.nome = "default.jpeg"
    fotoDefault.nomeGuardado = fotoDefault.nome

    fotoPerfil.fotos.push(fotoDefault)

    utilizador.fotoPerfil = fotoPerfil
    
    User.inserir(utilizador)
    .then(dados => {
        console.log('Entrei no then do post de users')
        User.atualizarFotoPerfil(dados._id, dados.fotoPerfil.fotos[0]._id)
        .then(dados2 =>{
            fs.mkdirSync(__dirname + '/../../uploaded/'+ utilizador.username+'/');
            res.jsonp(dados2)
        })
        .catch(erroAtualizaFotoPerfil => res.status(500).send("ERRO NA ATUALIZAÇÃO DA FOTO DE PERFIL: " + erroAtualizaFotoPerfil))
    })    
    .catch(erro => res.status(500).send('Erro na inserção de utilizador' + erro))
})

router.post('/novaFotoPerfil', (req, res) => {
    var form = new formidable.IncomingForm()
    form.parse(req, (erro, fields, files)=>{
        if(!erro){
            if(Object.keys(files).length){
				parseFicheiros(fields, files)
				.then(objFoto => {
                    User.inserirFotoPerfil(fields.uid, objFoto)
                    .then(dados =>{console.log(JSON.stringify(dados))})
                    .catch(erroGuardarFoto => res.status(500).send("ERRO AO TENTAR GUARDAR A FOTO DE PERFIL ", erroGuardarFoto))
				})
				.catch(erro =>{
					console.log("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
					res.status(500).send("ERRO NA CRIAÇÃO DO ELEMFICHEIRO ", erro)
				})
			}
        }
    })
})

async function parseFicheiros(fields, files){
    
    return new Promise((objFoto, erro) =>{
        var nome = files[fich].name
        var parts = nome.split('.')
        var extention = "." + parts[parts.length - 1]
        
        var pasta = path.resolve(__dirname + '/../uploaded/' + fields.username+'/fotos/')
        
        salt = randomstring.generate(64)

        var foto = {}
        foto.nomeGuardado = hash('sha1').update(fields.username + nome + salt + dataCalendario).digest('hex')
        foto.nome = nome
        
        var fnovo =  pasta + '/' + foto.nomeGuardado + extention
        var fenviado = files[fich].path

        //Verificação da existencia da pasta do dia (será que cria a do utilizador também?)
        if(!fs.existsSync(pasta)){
            fs.mkdirSync(pasta)
        }

        fs.rename(fenviado, fnovo, error => {
            if(error){
                console.log('errou no rename: ' + error) 
                erro(error)
            }
            else
                objFoto(foto)
        })
    })
}

module.exports = router;
