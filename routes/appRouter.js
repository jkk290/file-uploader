const { Router } = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })
const checkAuth = require('../middleware/checkAuth');
const appController = require('../controllers/appController');

const appRouter = Router();

appRouter.get('/login', appController.loginGet);
appRouter.get('/upload/add', checkAuth, appController.uploadAddGet);
appRouter.get('/folder/add', checkAuth, appController.folderAddGet);
appRouter.get('/folder/:id/edit', checkAuth, appController.folderEditGet);
appRouter.get('/file/:id/edit', checkAuth, appController.fileEditGet);
appRouter.get('/file/:id/download', checkAuth, appController.fileDownloadGet);
appRouter.get('/file/:id', checkAuth, appController.fileGet);
appRouter.get('/folder/:id', checkAuth, appController.folderGet);
appRouter.post('/folder/:id/edit', checkAuth, appController.folderEditPost);
appRouter.post('/folder/:id/delete', checkAuth, appController.folderDeletePost);
appRouter.post('/file/:id/edit', checkAuth, appController.fileEditPost);
appRouter.post('/file/:id/delete', checkAuth, appController.fileDeletePost);
appRouter.post('/folder/add', checkAuth, appController.folderAddPost);
appRouter.post('/login', appController.loginPost);
appRouter.post('/upload/add', checkAuth, upload.single('file'), appController.uploadAddPost);
appRouter.post('/logout', appController.logoutPost);
appRouter.get('/', checkAuth, appController.getApp);

module.exports = appRouter;