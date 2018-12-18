var User = require('../../models/users')

//Lista de Utilizadores

module.exports.listar = () => {
    return User
            .find()
            .sort({nome : -1})
            .exec()

}
// Devolve a informacao de um utilizador


module.exports.consultar = uid => {
    return Evento
            .findOne({_id: uid})
            .exec()
}


module.exports.inserir = utilizador => {
    return User.create(utilizador)
}

module.exports.inserirPub = (utilizador_id, pub_id) => {
    return User.findByIdAndUpdate(utilizador_id, {
         "$push": { "pubs": pub_id } },
         (err, res) => {
             if (!err) {
                 console.log(res)
             }
             else {
                 console.log("Erro : " + err)
             }
         })
}
