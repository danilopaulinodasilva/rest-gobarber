const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../../config/auth'); // arquivo de config para o jwt, pode ser usando .env

class SessionController {
    async store(req,res) {

        const { email, password } = req.body;

        // verifica se o email existe, então findOne 
        const user = await User.findOne({ where: { email } });

        // não existe, já interrompe o fluxo dando res.status().json()
        if(!user) {
            return res.status(401).json({ error: 'User not found'});
        }
        
        // verifica se a senha que ele passou realmente bate com a senha do banco de dados
        // para isso usa-se o checkPassword() que está no model User  
        if(!(await user.checkPassword(password))) { // o metodo checkPassword é assincrono, por isso o await. aguardando um false por isso a negação com !
            return res.status(401).json({ error: 'Password don\'t match' });
        }

        // apenas o que vai retornar do usuário, menos email que já está definido lá em cima
        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            // jwt.sign( payload + string única + expiração  )
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        })
    }
}

module.exports = new SessionController();