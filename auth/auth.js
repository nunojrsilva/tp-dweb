var passport = require('passport')

var localStrategy = require('passport-local').Strategy

var FacebookStrategy = require('passport-facebook').Strategy

var UserModel = require('../models/users')

//Registo de um utilizador


// function isAuth(req, res, next) {
//     if (req.headers.authorization) {
//         passport.authenticate('jwt', {session: false}, function (err, user, info) {
//             if ((!err || !info) && user) {
//                 req.user = user;
//                 return next();
//             }
//             res.status(401).json({authenticated: false, message: "Login expired."});
//         })(req, res, next);
//     } else {
//         if (req.isAuthenticated())
//             return next();
//         res.status(401).json({authenticated: false});
//     }
// }

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
    

        var user = await UserModel.create({nome, username, password, fotoPerfil})
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
    profileFields: ['id','name','email']
  },
  async function(accessToken, refreshToken, profile, done) {
      console.log(accessToken)
      console.log(refreshToken)
      console.log(profile)
      var username = profile.id

      var user = await (UserModel.findOne({username}))
        
      if (!user) {
        var nome = profile.name.givenName
        
        var password = "1234"

        var fotoPerfil = {}
        fotoPerfil.idAtual = null
        fotoPerfil.fotos = []

        var fotoDefault = {}
        fotoDefault.nome = "default.jpeg"
        fotoDefault.nomeGuardado = fotoDefault.nome
    
        fotoPerfil.fotos.push(fotoDefault)
    

        var user = await UserModel.create({nome, username, password, fotoPerfil})
        return done(null, user, {message: "Login com sucesso"})
      }
      else {
        return done(null, user, {message: "Login com sucesso"})

      }
  }
));


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });


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