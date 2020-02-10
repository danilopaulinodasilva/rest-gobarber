const { Router } = require('express');
const routes = new Router();
const User = require('./app/models/User');

routes.get('/', async (req,res) => {

    const user = await User.create({
        name: 'Danilo Silva',
        email: 'danilo@gmail.com',
        password_hash: '1238712387',
    });

    return res.json(user);
});

module.exports = routes;