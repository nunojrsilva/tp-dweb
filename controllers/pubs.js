var Pub = require('../models/pubs')

var pop_config = {
	path: 'utilizador',
	select:'nome username'
}

//Lista de publicações
module.exports.listar = () => {
    return Pub
            .find()
			.populate(pop_config)
			.sort({data : -1})
            .exec()
}

// Devolve a informacao de uma publicação
module.exports.consultar = pid => {
    return Pub
            .findOne({_id: pid})
			.populate(pop_config)
			.exec()
}

module.exports.listarPorUserPublico = (uid, publico) => {
	return Pub
			.find({utilizador: uid, publico: publico})
			.populate(pop_config)
			.sort({data:-1})
			.exec()
}

module.exports.listarPorUser = (id) => {
	return Pub
			.find({utilizador: id})
			.populate(pop_config)
			.sort({data:-1})
			.exec()
}

module.exports.listarPorHashtag = hashtag => {
	return Pub
			.find({"elems.hashtags":{ $all: [hashtag] }})
			.populate(pop_config)
			.sort({data:-1})
			.exec()
}

module.exports.listarTipo = tipo => {
	return Pub
			.find({tipo: tipo})
			.populate(pop_config)
			.sort({data:-1})
			.exec()
}

module.exports.listarPorData = data => {
	return Pub
			.find({data: {$gte: data}})
			.populate(pop_config)
			.sort({data:-1})
			.exec()
}

module.exports.inserir = publicacao => {
	console.log("-----------------------------------PUBLICAÇÃO-----------------------------------")
	console.log(JSON.stringify(publicacao))
	console.log("--------------------------------------------------------------------------------")
    return Pub.create(publicacao)
}

module.exports.remover = pid => {
    return Pub
			.deleteOne({_id: pid})
			.exec()
}

