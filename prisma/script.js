
const {PrismaClient} = require("@prisma/client")
const client = new PrismaClient();

async function createUser(req) {
    const result = await client.user.create({
        data: {
            username: req.username,
            password: req.password
        }
    });
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
    return user;
}

async function getUserById(id) {
    console.log(`getUserByid: request is ${JSON.stringify(id)}`);
    const user = await client.user.findUnique({
        where: {
            id:  id
        }
    });
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
    // console.log(`got folders ${JSON.stringify(folders)}`);
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
    // console.log(`got folders ${JSON.stringify(folders)}`);
    // to do : get files as well
    return folders;
}

async function getCurrnetFolderById(req) {
    const folder = await client.folder.findUnique({
        where: {
            id: req.id
        },
        include: {
            parentFolder: {
                include : {
                    parentFolder: {
                        include: {
                            parentFolder: true
                        }
                    }
                }
            }
        }
    });
    // to do : get files as well
    return folder;
}

// do i need user id here? 
async function getFiles(req) {
    const files = await client.file.findMany({
        where: {
            folderId: req.id
        }
    });
    // console.log(`got files ${JSON.stringify(files)}`);
    return files;
}

async function createFile(req){
    await client.file.create({
        data: {
            name: req.name,
            folderId: req.folderId,
            address: req.address,
            date: new Date()
        }
    })
}

async function getFile(req) {
    const file = await client.file.findUnique({
        where : {
            id: req.id
        }
    });
    console.log(`got file : ${JSON.stringify(file)}`);
    return file;
}

module.exports = {
    getUserById,
    getUserByName,
    createUser,
    getFoldersByUserId,
    getFoldersById,
    getCurrnetFolderById,
    createFolder,
    getFiles,
    createFile,
    getFile
}
