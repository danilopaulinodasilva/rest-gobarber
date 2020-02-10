const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../../config/auth');

module.exports = async (req,res, next) => {
    
    // pego o Bearer token no header da chamada
    const authHeader = req.headers.authorization;

    // não encontrou o header, quebra o fluxo
    if(!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    /*

    ex.: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTU4MTMyNzcwNywiZXhwIjoxNTgxOTMyNTA3fQ.Qjw3RW5hgwQKB-MY5AlNmi6IpgOH22DdHBB5xO_CoZ

    desestruturação para evitar de pegar a primeira 
    parte do token, antes era:

    [
        Bearer,
        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTU4MTMyNzcwNywiZXhwIjoxNTgxOTMyNTA3fQ.Qjw3RW5hgwQKB-MY5AlNmi6IpgOH22DdHBB5xO_CoZ
    ]

    agora com o split(' ') vai quebrar em dois
    e ignorar o Bearer escrito na primeira chave,
    por isso o , sozinho

    */

    const [, token] = authHeader.split(' ');

    try {
        // o { id } veio até aqui
                            // usa-se promisify pq o async do jwt.verify é baseado em callback
                                                    // passo o token recebido e a chave secreta para verificar o jwt
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        /*  adiciona o id do usuário dentro do req
            como isso aqui é um middleware, daqui pra frente
            ou aqui dentro ficará disponível essa info de id
            ao usar req.PARAMETRO
        
        */
       
        req.userId = decoded.id;

        return next();

    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' })
    }

};