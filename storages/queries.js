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

async function addFolder(folder) {
    await prisma.folder.create({
        data: {
            name: folder.name,
            ownerId: folder.ownerId
        }
    });
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

module.exports = {
    getUser,
    getUserById,
    getFolders,
    getFolderById,
    addFolder,
    editFolder,
    deleteFolder
};