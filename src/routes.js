const { Router } = require('express');
const routes = new Router();
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const authMiddleware = require('./app/middlewares/auth');

routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);
routes.post('/session', SessionController.store);

module.exports = routes;