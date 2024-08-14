const db = require("../prisma/script");

async function getFolderById(req, res) {
    if(!req.user) return res.redirect('/login');
    let folder_id = 'root';
    if (req.params && req.params.folder_id) {
        folder_id = req.params.folder_id;
    }
    const request = {
        id: folder_id,
        userId: req.user.id
    }
    const folders = await db.getFoldersById(request)
    res.render("homepage", {folders,  files: [], parentFolderId: folder_id});
}

async function createFolder(req, res) {
    if(!req.user) return res.redirect('/login');
    const body = req.body;
    const parentFolderId = req.params.folder_id || 'root';
    const request = {
        parentFolderId,
        name: body.name,
        userId: req.user.id,
    }
    await db.createFolder(request);
    res.redirect('/folders/${parentFolderId}');
}
module.exports = {
    createFolder,
    getFoldersByUserId,
    getFolderById
}