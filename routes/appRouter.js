const { Router } = require('express');
const checkAuth = require('../middleware/checkAuth');
const appController = require('../controllers/appController');

const appRouter = Router();

appRouter.get('/login', appController.loginGet);
appRouter.get('/upload/add', appController.uploadAddGet);
appRouter.post('/login', appController.loginPost);
appRouter.post('/upload/add', appController.uploadAddPost);
appRouter.post('/logout', appController.logoutPost);
appRouter.get('/', checkAuth, appController.getApp);

module.exports = appRouter;