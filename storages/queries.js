const prisma = require('./prisma');

async function getUser(email) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    return user;
};

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    return user;
};

async function getFolders(id) {
    const folders = await prisma.folder.findMany({
        where: {
            ownerId: id
        }
    });
    console.log('Got folders...', folders);
    return folders;
};

async function getFolderById(id) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: id
        }
    });
    console.log('Found folder', folder);
    return folder;
};

async function getRootFolder(ownerId) {
    const rootFolder = await prisma.folder.findFirst({
        where: {
            ownerId: ownerId,
            isRoot: true
        }
    });

    if (rootFolder === null) {
        const folder = {
            name: 'root',
            ownerId: ownerId,
            isRoot: true
        };
        await addFolder(folder);

        return await getRootFolder(ownerId);
    } else {
        return rootFolder;
    }
};

async function addFolder(folder) {
    if (folder.isRoot) {
        await prisma.folder.create({
            data: {
                name: folder.name,
                ownerId: folder.ownerId,
                isRoot: folder.isRoot
            }
        });
    } else {
        await prisma.folder.create({
            data: {
                name: folder.name,
                ownerId: folder.ownerId
            }
        });
    };
    
};

async function editFolder(id, folderName) {
    await prisma.folder.update({
        where: {
            id: id,
        },
        data: {
            name: folderName
        }
    });
};

async function deleteFolder(id) {
    await prisma.folder.delete({
        where: {
            id: id
        }
    });
};

async function getUserFiles(userId) {
    const files = await prisma.file.findMany({
        where: {
            ownerId: userId
        }
    });
    return files;
};

async function getRootFiles(userId) {
    const files = await prisma.file.findMany({
        where: {
            ownerId: userId,
            folder: {
                isRoot: true
            }
        },
    });
    return files;
};

async function getFilesByFolder(folderId) {
    const files = await prisma.file.findMany({
        where: {
            folderId: folderId
        }
    });
    return files;
};

async function getFileById(id) {
    const file = await prisma.file.findUnique({
        where: {
            id: id
        }
    });
    return file;
};

async function addFile(file) {
    await prisma.file.create({
        data: {
            name: file.name,
            size: file.size,
            fileType: file.fileType,
            ownerId: file.ownerId,
            folderId: file.folderId,
            filePath: file.filePath
        }
    });
};

async function editFile(id, fileName) {
    await prisma.file.update({
        where: {
            id: id
        },
        data: {
            name: fileName
        }
    });
};

async function deleteFile(id) {
    await prisma.file.delete({
        where: {
            id: id
        }
    });
};

module.exports = {
    getUser,
    getUserById,
    getFolders,
    getFolderById,
    getRootFolder,
    addFolder,
    editFolder,
    deleteFolder,
    getUserFiles,
    getFileById,
    getFilesByFolder,
    getRootFiles,
    addFile,
    editFile,
    deleteFile
};