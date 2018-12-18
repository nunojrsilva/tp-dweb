var mongoose = require('mongoose')



var Schema = mongoose.Schema

ObjectId = Schema.ObjectId;

 var UserSchema = new Schema({
    nome: {type: String, required : true},
    username: {type: String, required : true},
    password: {type: String, required : true},
    pubs : [{type: ObjectId, required : true}]
})


module.exports = mongoose.model('User', UserSchema, 'users')
