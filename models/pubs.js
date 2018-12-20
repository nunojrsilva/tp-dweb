var mongoose = require('mongoose')

var Schema = mongoose.Schema


var ficheiroSchema = new Schema({
    tipo: {type: String, required: true},
    caminho: {type: String, required: true}
})

var eventoSchema = new Schema({
    titulo: {type: String, required: true},
    data: {type: Date, required: true},
    atividade: {type: String, required: true},
    duracao: {type: String, required: false},
    descricao: {type: String, required: false}
})

var narracaoSchema = new Schema({
    texto: {type: String, required: true},
    autor: {type: String, required: false}
})

var PubSchema = new Schema({
    data: {type: Date, required: true},
    tipo: {type: String, required: true},
    local: {type: String, required: false},
    publico: {type: Boolean, required: true},
    hashtags: [{type: String, required: true}],
    titulo: {type: String, required: false},
    opiniao: {type: String, required: false},
    narracao: narracaoSchema,
    evento: eventoSchema,
    ficheiros: [ficheiroSchema]
})


module.exports = mongoose.model('Pub', PubSchema, 'pubs')