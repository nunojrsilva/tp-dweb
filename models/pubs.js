var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ObjectId = Schema.Types.ObjectId


var ficheirosSchema = new Schema({
    titulo: {type: String, required: false},
    ficheiros: [{type: String, required: true}] // Nome dos ficheiros
})

var eventoSchema = new Schema({  // REVER ESTE CASO *OU MAIS GERAL OU COM SUB EVENTOS*
    titulo: {type: String, required: true},
    data: {type: Date, required: true},
    atividade: {type: String, required: true},
    duracao: {type: String, required: false},
    descricao: {type: String, required: false}
})

var narracaoSchema = new Schema({
    titulo: {type: String, required: false},
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
    tipo: {type: String, required: true}, // Para preencher pelo servidor
    opiniao: opiniaoSchema,
    narracao: narracaoSchema,
    evento: eventoSchema,
    ficheiros: ficheirosSchema, //feito
    lista: listaSchema //feito
})

var comentarioSchema = new Schema ( {
    utilizador : {type: ObjectId, required: true},
    Texto : {type : String, required : true}
})

var PubSchema = new Schema({
    utilizador: {type: ObjectId, required: true, ref: 'User'},
    hashtags: [{type: String, required: true}],
    data: {type: Date, required: true}, // Para preencher pelo servidor
    local: {type: String, required: false},
    publico: {type: Boolean, required: true},
    tituloPub: {type: String, required: false},
    elems: [{type: elemSchema, required: true}],
    comentarios : [{type: comentarioSchema}]
})


module.exports = mongoose.model('Pub', PubSchema, 'pubs')