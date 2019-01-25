var Pub = require('../models/pubs')
var mongoose = require('mongoose')

var pop_config = {
	path: 'utilizador',
	select:'nome username'
}

var pop_config2 = {
	path: 'comentarios.utilizador',
	select: 'nome username'
}

//Lista de publicações
module.exports.listar = () => {
    return Pub
            .find()
			.populate(pop_config)
			.populate(pop_config2)
			.sort({data : -1})
            .exec()
}

// Devolve a informacao de uma publicação
module.exports.consultar = pid => {
    return Pub
            .findOne({_id: pid})
			.populate(pop_config)
			.populate(pop_config2)
			.exec()
}

module.exports.listarPorUserPublico = (uid, publico) => {
	return Pub
			.find({utilizador: uid, publico: publico})
			.populate(pop_config)
			.populate(pop_config2)
			.sort({data:-1})
			.exec()
}

module.exports.listarPorUser = (id) => {
	return Pub
			.find({utilizador: id})
			.populate(pop_config)
			.populate(pop_config2)
			.sort({data:-1})
			.exec()
}

module.exports.listarPorHashtag = hashtag => {
	return Pub
			.find({"elems.hashtags":{ $all: [hashtag] }})
			.populate(pop_config)
			.populate(pop_config2)
			.sort({data:-1})
			.exec()
}

module.exports.listarTipo = tipo => {
	return Pub
			.find({tipo: tipo})
			.populate(pop_config)
			.populate(pop_config2)
			.sort({data:-1})
			.exec()
}

module.exports.listarPorData = data => {
	return Pub
			.find({data: {$gte: data}})
			.populate(pop_config)
			.populate(pop_config2)
			.sort({data:-1})
			.exec()
}

module.exports.inserir = publicacao => {
    return Pub.create(publicacao)
}

module.exports.remover = pid => {
    return Pub
			.deleteOne({_id: pid})
			.exec()
}

module.exports.inserirComentario = (pub_id, comentario) => {
	console.log("Pub : " + pub_id)
    console.log("Comentario : " + comentario)
    return Pub.findOneAndUpdate(
        {_id : pub_id}, 
        {"$push": { comentarios: comentario } }, 
        {new : true})
}

module.exports.consultarFicheiro = (idPub, idFich) => {
	var pub = mongoose.Types.ObjectId(idPub)
	var fich = mongoose.Types.ObjectId(idFich)
	return Pub
		.aggregate([{$match: {_id: pub}}, 
		{$unwind: "$elems"}, 
		{$match: {'elems.tipo': "ficheiros"}}, 
		{$unwind: "$elems.ficheiros.ficheiros"}, 
		{$match: {"elems.ficheiros.ficheiros._id": fich}}, 
		{$project:{"elems.ficheiros.ficheiros": 1}}])
		.exec()
}
