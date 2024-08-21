const db = require("../prisma/script");
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// created placeholder row in folder with id = root for homepage
const rootFolderId = 'root';

async function getFolderById(req, res) {
    // console.log(`session data is ${JSON.stringify(req.session)}`);
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

function getCreateFile(req, res) {
    res.render("addFile", {folder_id: req.params.folder_id});
}

function getCreateFolder(req, res) {
    res.render("addFolder", {parentFolderId: req.params.folder_id});
}

async function createFile(req, res) {
    const file = req.file;
    if(!file) {
        res.status(404).json({error: "no file uploaded"});
    }

    const {data, error} = await supabaseClient.storage
        .from('b1')
        .upload(`${file.originalname}`, file.buffer, {
            contentType: file.mimetype
        });
    if (error) {
        console.log(`err is ${JSON.stringify(error)}`);
        throw error;
    }

    let folder_id = rootFolderId;
    if (req.params && req.params.folder_id) {
        folder_id = req.params.folder_id;
    }
    const request = {
        name: req.body.name,
        folderId: folder_id,
        address: data.path
    }
    await db.createFile(request);
    res.redirect(`/folders/${folder_id}`);
}

async function getFile(req, res) {
    const request = {
        id: req.params.file_id
    }
    try {
        const file = await db.getFile(request);
        const {data, error} = await supabaseClient.storage
            .from('b1')
            .createSignedUrl(file.address, 60*60);
        if (error) {
            throw error;
        } else {
            const signedUrl = data.signedUrl;
            res.render("fileDetails", {file, signedUrl});
        }
    } catch (err) {
        console.log(`err ${JSON.stringify(err)}`);
        res.status(500).send('Error downloading the file');
    }
}

module.exports = {
    createFolder,
    getFolderById,
    getCreateFolder,
    createFile,
    getCreateFile,
    getFile
}