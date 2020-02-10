const User = require('../models/User');

class UserController {

    async store(req,res) {

        // verifica se o usuário já existe no banco
        const userExists = await User.findOne({ where: { email: req.body.email }})

        // retornando true, então interrompe o fluxo enviando um return res.status().json()
        if(userExists) {
            return res.status(400).json({ error: 'User already exits' });
        }

        // do contrario, segue o fluxo

        // desestruturação para pegar apenas campos que interessam
        const { id, name, email, provider } = await User.create(req.body);

        // retorna os campos definidos acima
        return res.json({
            id,
            name,
            email,
            provider
        });
    }

    async update(req,res) {
        return res.json({ ok: true })
    }

}

module.exports = new UserController();