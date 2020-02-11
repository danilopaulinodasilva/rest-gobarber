const Yup = require('yup');
const User = require('../models/User');

class UserController {

    async store(req,res) {

        // schema de validação do Yup
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        // se a validação do schema falhar, interrompe o fluxo e retorna o erro
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: 'Validation failed'
            });
        }

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

        // schema de validação do Yup
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                // quando for preenchido o oldPassword, o campo field (password) vira obrigatório
                .when('oldPassword', (oldPassword, field) =>
                    // usando 
                    oldPassword ? field.required() : field
                ),
            // obriga o usuário a digitar no JSON o confirmPassword, se não retorna validation faild
            confirmPassword: Yup.string().when('password', (password, field) =>
                // com oneOf recebe um array com possiveis valores do campo, no caso, password usando ref()
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        // se a validação do schema falhar, interrompe o fluxo e retorna o erro
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: 'Validation failed?'
            });
        }

        const { email, oldPassword } = req.body;

        // busca o usuario dentro do banco com a função findByPk (find by primary key) no caso id que vem do middleware no req.userId
        // e retorna um objeto completo com todos dados encontrados no database, para ser usado daqui pra frente como: user
        const user = await User.findByPk(req.userId);

        // caso ele queira mudar, verifica se o email já não existe no banco
        if(email !== user.email) {

            // procura o email usando findOne
            const userExists = await User.findOne({ where: { email: req.body.email } });

            // se existir retorna que o email já existe
            if(userExists) {
                return res.status(400).json({ error: 'Email already existis' });
            }
        }

        // se o usuário passou o oldPassword e se a senha antiga realmente bate com a senha do database
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' })
        }
        
        // se tudo der certo acima, faz o update do usuario através do model
        const { id, name, provider } = await user.update(req.body);

        // retorna os campos definidos acima
        return res.json({
            id,
            name,
            email,
            provider
        });

    }

}

module.exports = new UserController();