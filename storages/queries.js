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

module.exports = {
    getUser,
    getUserById
};