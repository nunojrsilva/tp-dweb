var mongoose = require('mongoose')

var bcrypt = require('bcrypt')

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
    seguidores: [{type: ObjectId, required : true}],
    aSeguir: [{type: ObjectId, required : true}],
    salt : {type:String, required : false},
    fotoPerfil: {type: FotoPerfilSchema, required: true}
})

UserSchema.pre('save', async function (next) {
    var hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
    
})

UserSchema.methods.isValidPassword = async function(password) {
    var user = this
    var compare = await bcrypt.compare(password, user.password)
    console.log("Password enviada : " + password)
    return compare
}


var UserModel = mongoose.model('User', UserSchema)


module.exports = UserModel
