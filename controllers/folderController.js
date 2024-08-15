const db = require("../prisma/script");

const rootFolderId = 'root';
async function getFolderById(req, res) {
    if(!req.user) { 
        return res.redirect('/login');
    }
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

// todo: when creating file in root, there is no corresponding folder, thus error
async function createFile(req, res) {
    if(!req.user) { 
        return res.redirect('/login');
    }
    let folder_id = rootFolderId;
    if (req.params && req.params.folder_id) {
        folder_id = req.params.folder_id;
    }
    const body = req.body;
    const request = {
        name: body.name,
        folderId: folder_id,
        address: body.address
    }
    await db.createFile(request);
    res.redirect(`/folders/${folder_id}`);
}
module.exports = {
    createFolder,
    getFolderById,
    createFile
}