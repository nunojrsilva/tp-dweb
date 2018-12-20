var Pub = require('../../models/pubs')

//Lista de publicações

module.exports.listar = () => {
    return Pub
            .find()
            .sort({data : -1})
            .exec()
}

// Devolve a informacao de uma publicação
module.exports.consultar = pid => {
    return Pub
            .findOne({_id: pid})
            .exec()
}

module.exports.listarPublico = value => {
	return Pub
		.find({publico: value})
		.sort({data:-1})
		.exec()
}

module.exports.listarHashtag = hashtag => {
	return Pub
		.find({hashtags:{ $all: [hashtag] }})
		.sort({data:-1})
		.exec()
}

module.exports.listarTipo = tipo => {
	return Pub
		.find({tipo: tipo})
		.sort({data:-1})
		.exec()
}

module.exports.listarData = data => {
	return Pub
		.find({data: {$gte: data}})
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

