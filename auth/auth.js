var passport = require('passport')

var localStrategy = require('passport-local').Strategy

var FacebookStrategy = require('passport-facebook').Strategy

var UserModel = require('../models/users')

var UserController = require('../controllers/users')

let fs = require('fs');
var hash = require('crypto').createHash;
var randomstring = require('randomstring');
var request = require('request');

//Registo de um utilizador


passport.use('registo', new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback: true,
},  async (req, username, password, done) => {
    console.log("U : " + username)
    try {
        console.log("Body no registo" + JSON.stringify(req.body))
        var nome = req.body.nome
        var fotoPerfil = {}
        fotoPerfil.idAtual = null
        fotoPerfil.fotos = []

        var fotoDefault = {}
        fotoDefault.nome = "default.jpeg"
        fotoDefault.nomeGuardado = fotoDefault.nome
    
        fotoPerfil.fotos.push(fotoDefault)

        seguidores = []
        aSeguir = []

        var user = await UserModel.create({nome, username, password, fotoPerfil, seguidores, aSeguir})

        fs.mkdirSync(__dirname + '/../uploaded/'+ user.username +'/')

        //ESTA MERDA ESTA MAL (res its not defined)
        UserController.atualizarFotoPerfil(user._id, user.fotoPerfil.fotos[0]._id)
            .then(dados2 =>{
                return res.jsonp(dados2)
            })
            .catch(e =>
                { 
                console.log("Erro ao atualizar foto" + e)
                return res.jsonp(user)
            })
        return done(null, user)
    }   

    catch (error) {

        console.log("Erro no auth de registo" + error)

        return done(error)

    }
}) )



// Login

passport.use('login', new localStrategy({
    usernameField : 'username',
    passwordField : 'password'
},async (username, password, done) => {
    try {

        var user = await (UserModel.findOne({username}))
        
        if (!user)
            return done (null, false, {message: "Utilizador não existe"})
        
        var valid = await user.isValidPassword(password)

        if (!valid)
            return done(null, false, {message: "Password inválida"} )

        return done(null, user, {message: "Login com sucesso"})


    }

    catch (error) {

        return done(error)

    }
}) )

// Autenticacao com Facebook



passport.use('facebook', new FacebookStrategy({
    clientID: '2271866706375412',
    clientSecret: 'd3d4bd057aa4a8b25401e6d79287fa7c',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id','name','email','picture.type(large)']
  },
  async function(accessToken, refreshToken, profile, done) {
      console.log(accessToken)
      console.log(refreshToken)
      console.log(profile)

      var username = profile.id

      var user = await (UserModel.findOne({username}))
        
      if (!user) {
        var nome = profile.name.givenName

        var salt = randomstring.generate(128)

        var data = new Date()

        var dataCalendario = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
        
        var password = hash('sha1').update(username + nome + salt + dataCalendario).digest('hex')

        
        var fotoPerfil = {}
        fotoPerfil.idAtual = null
        fotoPerfil.fotos = []

        var fotoHashed = hash('sha1').update(username + nome + salt).digest('hex')

        // Tem de ser feito aqui porque o download vai guardar nessa pasta

        fs.mkdirSync(__dirname + '/../uploaded/'+ username +'/')
        fs.mkdirSync(__dirname + '/../uploaded/'+ username +'/fotos')

        download(profile.photos[0].value, __dirname + '/../uploaded/'+ username +'/fotos/'+ fotoHashed +'.jpeg', async function(){
            
            var foto = {}
            foto.nome = username + 'profileFB.jpeg'
            foto.nomeGuardado = fotoHashed
            foto.isImage = true

            fotoPerfil.fotos.push(foto)

            var user = await UserModel.create({nome, username, password, salt, fotoPerfil})


            UserController.atualizarFotoPerfil(user._id, user.fotoPerfil.fotos[0]._id)
                .then(dados2 =>{
                    return done(null, dados2, {message: "Registo com sucesso"})
                })
                .catch(e =>
                    { 
                    console.log("Erro ao atualizar foto com login no FB : " + e)
                    return done(null, user, {message: "Registo com sucesso, erro ao atribuir foto"})
                })
        })
    }
    else {

        var password = hash('sha1').update(user.username + user.nome + user.salt).digest('hex')
        
        var valid = await user.isValidPassword(password)
        if (valid) {
            console.log("password correta")
            return done(null, user, {message: "Login com sucesso"})
        }
        else return done(null, false, {message: "Erro no login"})
      }
  }
));

// Autenticacao com JWT


var JWTStrategy = require('passport-jwt').Strategy

var ExtractJWT = require('passport-jwt').ExtractJwt

var ExtractFromSession = function (req) {
    console.log("Usar extract from session")
    var token = null
    if (req && req.session) token = req.session.token
    return token
}

var ExtractFromHeader = function (req) {
    console.log("Usar extract from header")
    console.log("Header = " + req.headers['authorization'])
    var token = null
    if (req && req.headers['authorization']) token = req.headers['authorization'].split(" ")[1]
    console.log("Token recolhido no header :" + token)
    return token
}

passport.use('jwt', new JWTStrategy({
    secretOrKey : "dweb2018",
    jwtFromRequest : ExtractJWT.fromExtractors([ExtractFromSession, ExtractFromHeader])
}, async (token, done) => {
    try {
        return done(null, token.user)

    }
    catch (error) {
        return done(error)
    }

}))



var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};