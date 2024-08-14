
const {PrismaClient} = require("@prisma/client")
const client = new PrismaClient();

async function createUser(req) {
    const result = await client.user.create({
        data: {
            username: req.username,
            password: req.password
        }
    });
    console.log(JSON.stringify(result));
}

// technically username is unique here
async function getUserByName(req) {
    const user = await client.user.findFirst({
        where: {
            username: {
                equals: req.username
            }
        }
    });
    console.log(`users ${JSON.stringify(user)}`);
    return user;
}

async function getUserById(id) {
    console.log(`getUserByid: request is ${JSON.stringify(id)}`);
    const user = await client.user.findUnique({
        where: {
            id:  id
        }
    });
    console.log(`users ${JSON.stringify(user)}`);
    return user;
}

async function createFolder(req) {
    await client.folder.create({
        data: {
            name: req.name,
            userId: req.userId,
            parentFolderId: req.parentFolderId
        }
    });
}

async function getFoldersByUserId(req) {
    const folders = await client.folder.findMany({
        where: {
            userId: {
                equals : req.id
            }
        }
    });
    console.log(`got folders ${JSON.stringify(folders)}`);
    // to do : get files
    return folders;
}

async function getFoldersById(req) {
    const folders = await client.folder.findMany({
        where: {
            parentFolderId: req.id,
            userId: req.userId
        }
    });
    console.log(`got folders ${JSON.stringify(folders)}`);
    // to do : get files as well
    return folders;
}

module.exports = {
    getUserById,
    getUserByName,
    createUser,
    getFoldersByUserId,
    getFoldersById,
    createFolder
}

