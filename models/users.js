var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ObjectId = Schema.Types.ObjectId

var fotoSchema = new Schema({
    nomeGuardado: {type: String, required: true},
    nome: {type: String, required: true}
})

var FotoPerfilSchema = new Schema({
    idAtual: {type: ObjectId, required: false},
    fotos: [fotoSchema]
})

var UserSchema = new Schema({
    nome: {type: String, required : true},
    username: {type: String, required : true, unique: true},
    password: {type: String, required : true},
    pubs : [{type: ObjectId, required : true, ref : 'Pub'}],
    fotoPerfil: {type: FotoPerfilSchema, required: true}
})


module.exports = mongoose.model('User', UserSchema, 'users')
