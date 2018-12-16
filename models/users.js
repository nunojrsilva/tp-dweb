var mongoose = require('mongoose')

var Schema = mongoose.Schema

 var UserSchema = new Schema({
    nome: {type: String, required : true},
    username: {type: String, required : true},
    password: {type: String, required : true},
    pubs : [{type: ObjectId, required : true, ref : 'Pubs'}]
})


module.exports = mongoose.model('User', UserSchema, 'users')
