var express = require('express');
var router = express.Router();
var passport = require('passport')
var querystring = require('querystring')
var axios = require('axios')



router.get('/', (req,res) => {
  res.render("homepage")
})

//Login

router.get('/login', (req,res) => {
  console.log('Na cb do GET /login ...')
  res.render('login')

})

router.get('/registo', (req,res) => {
  console.log('Na cb do GET /login ...')
  res.render('registo')

})

router.get('/users',  (req,res) => {
  
  console.log("Token é : " + req.session.token )
  
  axios({
    method: 'get', //you can set what request you want to be
    url: 'http://localhost:3000/api/users',
    headers: {
      Authorization: 'Bearer ' + req.session.token
    }
  })
  .then(dados => res.jsonp(dados.data))
  .catch(e => {
          console.log("erro no get de /users : " + e)
          res.send();

  })
})


router.post("/login", (req,res) => {
  console.log("No login da pagina")
  var username = req.body.username
  var password = req.body.password
  axios.post("http://localhost:3000/api/users/login", {username, password})
    .then(dados => {
      console.log("Token: "+ JSON.stringify(dados.data.token))
      // Guardar o token
      req.session.token = dados.data.token
      res.redirect("/")
    })
    .catch(e => {
      console.log("Erro no /login" + e)
      res.status(500).send()
    })
})


router.post("/registo", (req,res) => {
  console.log("No registo da pagina")
  var username = req.body.username
  var password = req.body.password
  var nome = req.body.nome

  axios.post("http://localhost:3000/api/users", {nome, username, password}, { withCredentials: true })
    .then(dados => {
      console.log("Registo com sucesso, user criado : " + JSON.stringify(dados.data))
      res.redirect("/login")
    })
    .catch(e => {
      console.log("Erro no /registo " + JSON.stringify(e) )
      res.jsonp(e)
    })
})

router.get('/atualizarFotoPerfil', passport.authenticate('jwt', {session : false}), (req, res)=>{
  console.log("Entrou no get de /users/FotosPerfil " + req.user._id)
  
  axios({
    method: 'get', 
    url: "http://localhost:3000/api/users/FotosPerfil",
    headers: {
      Authorization: 'Bearer ' + req.session.token
    }
  })
  .then(info =>{
    res.render('alterarFotoPerfil', {fotos: info.data, userid: req.user._id})
  })
  .catch(error =>{
    console.log("ERRO AXIOS GET: " + error)
    res.status(500).send("ERRO AO PEDIR AS FOTOS DE PERFIL PARA ATUALIZAR" + error)
  })

})
router.get('/FotosPerfil', passport.authenticate('jwt', {session : false}), (req, res)=>{
  console.log("Entrou no get de /users/FotosPerfil " + req.user._id)
  
  axios({
    method: 'get', 
    url: "http://localhost:3000/api/users/FotosPerfil",
    headers: {
      Authorization: 'Bearer ' + req.session.token
    }
  })
  .then(info =>{
    res.render('fotosPerfil', {fotos: info.data, userid: req.user._id})
  })
  .catch(error =>{
    console.log("ERRO AXIOS GET: " + error)
    res.status(500).send("ERRO AO PEDIR AS FOTOS DE DO UTILIZADOR" + error)
  })

 
})
module.exports = router;
