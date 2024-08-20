const db = require("../prisma/script");
const path = require('path');

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
    // query the current folder to get parents + current folder name
    const getCurrentFolderRequest = {
        id: folder_id
    }
    const currentFolder = await db.getCurrnetFolderById(getCurrentFolderRequest);

    const breadCrumbs = getBreadCrumbs(currentFolder, []);
    const childFolders = await db.getFoldersById(request)
    const files = await db.getFiles(request);
    res.render("homepage", {childFolders,  files, currentFolder, breadCrumbs});
}

function getBreadCrumbs(currentFolder, arr) {
    if (currentFolder == null || currentFolder == undefined) {
        return []
    }
    arr = getBreadCrumbs(currentFolder.parentFolder, arr);
    const currentBreadCrumb = {
        name: currentFolder.name,
        id: currentFolder.id
    }
    arr.push(currentBreadCrumb);
    return arr;
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
    res.redirect(`/folders/${parentFolderId}`);
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

async function downloadFile(req, res) {
    if(!req.user) { 
        return res.redirect('/login');
    }
    const request = {
        id: req.params.file_id
    }
    const file = await db.getFile(request);
    const filePath = path.join('public', file.address);
    console.log(filePath);
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error while downloading file:', err);
        res.status(500).send('Could not download the file.');
      }
    });
}

module.exports = {
    createFolder,
    getFolderById,
    createFile,
    getFile,
    downloadFile
}