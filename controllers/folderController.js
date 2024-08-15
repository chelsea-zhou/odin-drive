const db = require("../prisma/script");

// created placeholder row in folder with id = root for homepage
const rootFolderId = 'root';

async function getFolderById(req, res) {
    if(!req.user) { 
        return res.redirect('/login');
    }
    console.log(`session data is ${JSON.stringify(req.session)}`);
    let folder_id = rootFolderId;
    if (req.params && req.params.folder_id) {
        folder_id = req.params.folder_id;
    }
    const request = {
        id: folder_id,
        userId: req.user.id
    }
    const folders = await db.getFoldersById(request)
    const files = await db.getFiles(request);
    res.render("homepage", {folders,  files: files, parentFolderId: folder_id});
}

async function createFolder(req, res) {
    if(!req.user) {
        return res.redirect('/login');
    }
    const body = req.body;
    const parentFolderId = req.params.folder_id || rootFolderId;
    const request = {
        parentFolderId,
        name: body.name,
        userId: req.user.id,
    }
    await db.createFolder(request);
    res.redirect('/folders/${parentFolderId}');
}

async function createFile(req, res) {
    if(!req.user) { 
        return res.redirect('/login');
    }
    console.log(`file is ${JSON.stringify(req.file)}`);

    let folder_id = rootFolderId;
    if (req.params && req.params.folder_id) {
        folder_id = req.params.folder_id;
    }
    const body = req.body;
    console.log(`req body is ${JSON.stringify(body)}`);
    const arr = req.file.path.split("public/");
    const relativePath = arr[arr.length - 1];
    const request = {
        name: body.name,
        folderId: folder_id,
        address: relativePath
    }
    await db.createFile(request);
    res.redirect(`/folders/${folder_id}`);
}

async function getFile(req, res) {
    if(!req.user) { 
        return res.redirect('/login');
    }
    const request = {
        id: req.params.file_id
    }
    const file = await db.getFile(request);
    res.render("fileDetails", {file});
}
module.exports = {
    createFolder,
    getFolderById,
    createFile,
    getFile
}