var User = require('../models/users')
var mongoose = require ('mongoose')

//Lista de Utilizadores

var pop_config = {
	path: 'aSeguir',
	select: 'nome username fotoPerfil.idAtual'
}

module.exports.listar = () => {
    return User
            .find()
            .sort({nome : -1})
            .exec()

}
// Devolve a informacao de um utilizador


module.exports.consultar = uid => {
    return User
            .findOne({_id: uid})
            .exec()
}

module.exports.consultarUsername = un => {
    return User
            .findOne({username: un},{_id: 1})
            .exec()
}

module.exports.contarPubs = pid => {
    return User
            .findOne({_id: pid})
			.exec()
}

module.exports.checkASeguir = (uid, tocheck) => {
    return User
            .find({_id: uid, aSeguir: tocheck})
            .count()
            .exec()
}

module.exports.getASeguir = uid => {
    return User
            .find({_id: uid}, {aSeguir: 1})
            .populate(pop_config)
            .exec()
}

module.exports.getASeguirESeguidores = uid => {
    return User
            .find({_id: uid}, {aSeguir: 1, seguidores: 1})
            .exec()
}


module.exports.consultarPerfil = (_id, fotoID) => {
    var uid = mongoose.Types.ObjectId(_id)
    var idAtual = mongoose.Types.ObjectId(fotoID)
    return User
            .aggregate([
            {$match: {_id: uid}},
            {$unwind: '$fotoPerfil.fotos'},
            {$match:{'fotoPerfil.idAtual': idAtual}},
            {$project: {'_id': 1, 'nome': 1, 'username': 1, 'fotoPerfil.idAtual': 1}}
            ])
            .exec()
}

module.exports.getIdAtual = uid => {
    return User
            .find({_id: uid}, {'fotoPerfil.idAtual': 1})
            .exec()
}


module.exports.obterFotoPerfil = (uid, fotoId) => {
	var id = mongoose.Types.ObjectId(uid)
    var fotoID = mongoose.Types.ObjectId(fotoId)
    
    return User
            .aggregate([
            {$match: {_id: id}},
            {$unwind: "$fotoPerfil.fotos"},
            {$match: {'fotoPerfil.fotos._id': fotoID}},
            {$project: {'fotoPerfil.fotos': 1}}
            ])
            .exec()
}

module.exports.obterFotosPerfil = uid => {
    var id = mongoose.Types.ObjectId(uid)
    
    return User
            .aggregate([
                {$match: {_id: id}},
                {$project: {'fotoPerfil.fotos': 1}}
            ])
            .exec()
}

module.exports.inserirFotoPerfil = (uid, foto) => {
	var id = mongoose.Types.ObjectId(uid)
    return User
            .findOneAndUpdate(
                {_id: id},
                {$push: {"fotoPerfil.fotos": foto}},
                {new: true})
            .exec()
}

module.exports.atualizarFotoPerfil = (uid, fotoId) => {
	var id = mongoose.Types.ObjectId(uid)
	var fotoID = mongoose.Types.ObjectId(fotoId)
    return User
            .findOneAndUpdate(
                {_id: id},
                {$set: {"fotoPerfil.idAtual": fotoID}},
                {new: true})
            .exec()
}

module.exports.inserirASeguir = (uidSeguidor, uidASeguir) => {
	var idSeguidor = mongoose.Types.ObjectId(uidSeguidor)
	var idASeguir = mongoose.Types.ObjectId(uidASeguir)
    return User
            .findOneAndUpdate(
                {_id: idSeguidor},
                {$push: {"aSeguir": idASeguir}},
                {new: true})
            .exec()
}

module.exports.inserirSeguidor = (uidASeguir, uidSeguidor) => {
	var idASeguir = mongoose.Types.ObjectId(uidASeguir)
	var idSeguidor = mongoose.Types.ObjectId(uidSeguidor)
    return User
            .findOneAndUpdate(
                {_id: idASeguir},
                {$push: {"seguidores": idSeguidor}},
                {new: true})
            .exec()
}

module.exports.removerASeguir = (uidSeguidor, uidAIgnorar) => {
	var idSeguidor = mongoose.Types.ObjectId(uidSeguidor)
	var idAIgnorar = mongoose.Types.ObjectId(uidAIgnorar)
    return User
            .findOneAndUpdate(
                {_id: idSeguidor},
                {$pull: {"aSeguir": idAIgnorar}},
                {new: true})
            .exec()
}

module.exports.removerSeguidor = (uidAIgnorar, uidSeguidor) => {
	var idSeguidor = mongoose.Types.ObjectId(uidSeguidor)
	var idAIgnorar = mongoose.Types.ObjectId(uidAIgnorar)
    return User
            .findOneAndUpdate(
                {_id: idAIgnorar},
                {$pull: {"seguidores": idSeguidor}},
                {new: true})
            .exec()
}

module.exports.inserir = utilizador => {
    return User.create(utilizador)
}

module.exports.inserirPub = (utilizador_id, pub_id) => {
    console.log("Utilizador : " + utilizador_id)
    console.log("Pub : " + pub_id)
    return User.findOneAndUpdate(
        {_id : utilizador_id}, 
        {$push: { pubs: pub_id } }, 
        {new : true})
}