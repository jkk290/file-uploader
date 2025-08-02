const { Router } = require('express');
const checkAuth = require('../middleware/checkAuth');
const appController = require('../controllers/appController');

const appRouter = Router();

appRouter.get('/login', appController.loginGet);
appRouter.post('/login', (req, res, next) => {
    console.log('post router hit!');
    next();
}, appController.loginPost);
appRouter.post('/logout', appController.logoutPost);
appRouter.get('/', checkAuth, appController.getApp);

module.exports = appRouter;