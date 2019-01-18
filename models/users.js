var mongoose = require('mongoose')

var Schema = mongoose.Schema

ObjectId = Schema.Types.ObjectId


 var UserSchema = new Schema({
    nome: {type: String, required : true},
    username: {type: String, required : true, unique: true},
    password: {type: String, required : true},
    pubs : [{type: ObjectId, required : true, ref : 'pubs'}]
})


module.exports = mongoose.model('User', UserSchema, 'users')
