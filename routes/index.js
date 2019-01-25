var express = require('express');
var router = express.Router();
var passport = require('passport')

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


router.post("/login", (req,res) => {
  console.log("No login da pagina")
  var username = req.body.username
  var password = req.body.password
  //axios.post('/login', { username, password }, { withCredentials: true })
  axios.post("http://localhost:3000/api/users/login", {username, password}, { withCredentials: true })
    .then(dados => {
      console.log("Token: "+ JSON.stringify(dados.data))
      req.session.token = dados.data.token
      res.redirect("/api/users")
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
})



// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/protegida',
//   failureRedirect: '/login'
// }))

//Proteger com middleware

// function verificaAutenticacao(req, res, next) {
//   if (req.isAuthenticated()) next()
//   else res.redirect('/login')
// }

// router.get('/protegida', verificaAutenticacao, (req,res) => {
//   res.send("Atingiste a área protegida")
// })


// router.get('/users', verificaAutenticacao, (req,res) => {
//   axios.get("http://localhost:5011/users")
//     .then(dados => {
//       res.render('users', {usersList : dados.data})
//     }
//   )
//     .catch(erro => {
//       res.render('error', {error: erro})
//     })
// })

module.exports = router;
