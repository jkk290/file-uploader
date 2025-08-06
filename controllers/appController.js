const passport = require("passport");
const db = require('../storages/queries');
const stripExtension = require('../utils/stripExtension');
const convertSize = require('../utils/convertSize');

exports.getApp = async (req, res) => {
    const user = req.user;
    const folders = await db.getFolders(user.id);
    res.render('app', {
        title: 'My Files',
        folders: folders
    });
};

exports.loginGet = (req, res) => {
    res.render('login', {
        title: 'Log in'
    });
};

exports.folderAddGet = (req, res) => {
    res.render('newFolder', {
        title: 'New Folder'
    });
};

exports.folderAddPost = async (req, res) => {
    const folder = {
        name: req.body.folderName,
        ownerId: req.user.id
    };
    console.log('Adding folder to db...', folder);
    await db.addFolder(folder);
    res.redirect('/');
};

exports.folderEditGet = async (req, res) => {
    const folder = await db.getFolderById(parseInt(req.params.id));
    res.render('editFolder', {
        title: 'Edit Folder',
        folder: folder
    });
};

exports.folderEditPost = async (req, res) => {
    const folderName = req.body.folderName;
    await db.editFolder(parseInt(req.params.id), folderName);
    res.redirect('/');
}

exports.folderDeletePost = async (req, res) => {
    await db.deleteFolder(parseInt(req.params.id));
    res.redirect('/');
};

exports.uploadAddGet = async (req, res) => {
    const folders = await db.getFolders(req.user.id);
    res.render('upload', {
        title: 'File Upload',
        folders: folders
    });
};

exports.uploadAddPost = async (req, res) => {
    console.log('file uploaded...', req.file);
    const fileName = stripExtension(req.file.originalname);
    const fileSize = convertSize(req.file.size);
    const fileFolder = req.body.folder;
    
    async function folderIsRoot(fileFolder) {
        if (fileFolder === 'root') {
            const folder = await db.getRootFolder(req.user.id);
            console.log('Got root folder...', folder);
            return folder.id;
        } else {
            console.log('Folder is not root...', fileFolder)
            return fileFolder;
        }
    };

    const folderId = await folderIsRoot(fileFolder);

    const file = {
        name: fileName,
        size: fileSize,
        fileType: req.file.mimetype,
        ownerId: req.user.id,
        folderId: folderId
    };

    await db.addFile(file);
    res.redirect('/');
};

exports.loginPost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

exports.logoutPost = (req, res, next) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        res.redirect('/');
    });
};