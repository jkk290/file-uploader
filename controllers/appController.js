const passport = require("passport");
const db = require('../storages/queries');
const supabase = require('../storages/supabase');
const convertSize = require('../utils/convertSize');
const { file } = require("../storages/prisma");

exports.getApp = async (req, res) => {
    const user = req.user;
    const folders = await db.getFolders(user.id);
    const rootFiles = await db.getRootFiles(user.id);
    res.render('app', {
        title: 'My Files',
        folders: folders,
        files: rootFiles
    });
};

exports.loginGet = (req, res) => {
    res.render('login', {
        title: 'Log in'
    });
};

exports.folderGet = async (req, res) => {
    const folderId = parseInt(req.params.id);
    const folder = await db.getFolderById(folderId);
    const files = await db.getFilesByFolder(folderId);
    res.render('folder', {
        title: folder.name,
        files: files
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
    const files = await db.getFilesByFolder(parseInt(req.params.id));
    const paths = [];
    files.forEach(file => {
        paths.push(file.filePath);
    });
    try {
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .remove(paths);
        if (error) {
            console.error(error)
        }
        console.log(data);
    } catch (error) {
        console.error(error)
    }

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
    let folderPath;

    try {
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(`public/${req.file.originalname}`, req.file.buffer, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error(error);
        } else {
            folderPath = data.path;
            console.log(data);
        }
    } catch (error) {
        console.error(error);
    };  

    const fileSize = convertSize(req.file.size);
    const fileFolder = req.body.folder;
    
    async function folderIsRoot(fileFolder) {
        if (fileFolder === 'root') {
            const folder = await db.getRootFolder(req.user.id);
            console.log('Got root folder...', folder);
            return folder.id;
        } else {
            console.log('Folder is not root...', fileFolder)
            return parseInt(fileFolder);
        }
    };

    const folderId = await folderIsRoot(fileFolder);

    const file = {
        name: req.file.originalname,
        size: fileSize,
        fileType: req.file.mimetype,
        ownerId: req.user.id,
        folderId: folderId,
        filePath: folderPath
    };

    await db.addFile(file);
    res.redirect('/');
};

exports.fileGet = async (req, res) => {
    const file = await db.getFileById(parseInt(req.params.id));
    console.log('Viewing file...', file);
    res.render('file', {
        file: file
    });
};

exports.fileEditGet = async (req, res) => {
    const file = await db.getFileById(parseInt(req.params.id));
    res.render('editFile', {
        title: 'Edit File',
        file: file
    });
};

exports.fileDownloadGet = async (req, res) => {
    const file = await db.getFileById(parseInt(req.params.id));

    try {
        const { data, error } = await supabase.storage.from('uploads').download(file.filePath)

        if (error) {
            console.error(error);
        } 

        const buffer = await data.arrayBuffer();

        res.set({
            'Content-Type': data.type || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.name || 'download'}"`,
            'Content-Length': buffer.byteLength
        });

        res.send(Buffer.from(buffer));

    } catch (error) {
        console.error(error);
    };
};

exports.fileEditPost = async (req, res) => {
    const fileName = req.body.fileName;
    await db.editFile(parseInt(req.params.id), fileName);
    res.redirect('/');
};

exports.fileDeletePost = async (req, res) => {
    const file = await db.getFileById(parseInt(req.params.id));
    try {
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .remove([file.filePath]);
        if (error) {
            console.error(error)
        }
        console.log(data);
    } catch (error) {
        console.error(error)
    }
    await db.deleteFile(parseInt(req.params.id));
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