const { Router } = require('express');
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads' })
const checkAuth = require('../middleware/checkAuth');
const appController = require('../controllers/appController');

const appRouter = Router();

appRouter.get('/login', appController.loginGet);
appRouter.get('/upload/add', appController.uploadAddGet);
appRouter.post('/login', appController.loginPost);
appRouter.post('/upload/add', upload.single('file'), appController.uploadAddPost);
appRouter.post('/logout', appController.logoutPost);
appRouter.get('/', checkAuth, appController.getApp);

module.exports = appRouter;