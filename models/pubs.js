var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ObjectId = Schema.Types.ObjectId


var ficheirosSchema = new Schema({
    titulo: {type: String, required: true},
    ficheiros: [{type: String, required: false}] // Nome dos ficheiros
})

var eventoSchema = new Schema({  // REVER ESTE CASO *OU MAIS GERAL OU COM SUB EVENTOS*
    titulo: {type: String, required: true},
    data: {type: Date, required: true},
    atividade: {type: String, required: true},
    duracao: {type: String, required: false},
    descricao: {type: String, required: false}
})

var narracaoSchema = new Schema({
    titulo: {type: String, required: true},
    texto: {type: String, required: true},
    autor: {type: String, required: false},
})

var opiniaoSchema = new Schema({
    opiniao: {type: String, required: true}
})

var listaSchema = new Schema({
    titulo: {type: String, required: true},
    itens: [{type: String, required: true}]
})

var elemSchema = new Schema({
    hashtags: [{type: String, required: true}],
    opiniao: opiniaoSchema,
    narracao: narracaoSchema,
    evento: eventoSchema,
    ficheiros: ficheirosSchema,
    lista: listaSchema
})

var comentarioSchema = new Schema ( {
    utilizador : {type: ObjectId, required: true},
    Texto : {type : String, required : true}
})

var PubSchema = new Schema({
    utilizador: {type: ObjectId, required: true, ref: 'User'},
    data: {type: Date, required: true},
    tipo: {type: String, required: true},
    local: {type: String, required: false},
    publico: {type: Boolean, required: true},
    tituloPub: {type: String, required: false},
    elems: [{type: elemSchema, required: true}],
    comentarios : [{type: comentarioSchema}]
})


module.exports = mongoose.model('Pub', PubSchema, 'pubs')