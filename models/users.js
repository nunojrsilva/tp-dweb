var mongoose = require('mongoose')

var bcrypt = require('bcrypt')

var Schema = mongoose.Schema

var ObjectId = Schema.Types.ObjectId


var UserSchema = new Schema({
    nome: {type: String, required : true},
    username: {type: String, required : true, unique: true},
    password: {type: String, required : true},
    pubs : [{type: ObjectId, required : true, ref : 'Pub'}]
})

UserSchema.pre('save', async function (next) {
    var hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
    
})

UserSchema.methods.isValidPassword = async function(password) {
    var user = this
    var compare = await bcrypt.compare(password, user.password)

    return compare
}


var UserModel = mongoose.model('user', UserSchema)


module.exports = UserModel
