const express = require("express");
const router = express.Router();
const folderController = require("../controllers/folderController");

const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage()})

function checkAuthentication (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
}

router.get('/', checkAuthentication, folderController.getFolderById);
router.get(`/folders/:folder_id`, checkAuthentication, folderController.getFolderById);
router.get(`/folders/:folder_id/new`, checkAuthentication, folderController.getCreateFolder);
router.post(`/folders/:folder_id/new`, checkAuthentication, folderController.createFolder);
// router.post(`folders/:folder_id/delete`, folderController.deleteFolder);

router.get(`/files/:file_id`, checkAuthentication, folderController.getFile);

router.get('/folders/:folder_id/files/new', checkAuthentication, folderController.getCreateFile);

// todo: this upload file name is a string, how to show file type? same as downloaded file
router.post('/folders/:folder_id/files/new', checkAuthentication, upload.single('file'), folderController.createFile);

module.exports = router;