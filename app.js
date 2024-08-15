const express = require("express");

const path = require('path');
const folderController = require("./controllers/folderController");
const userController = require("./controllers/userController");

const auth = require("./middleware/auth");
const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })

const app = express();
const passport = require('passport');

app.set("view engine", "ejs");
// Set the public directory to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use(auth.sessionManager());
app.use(passport.session());

// for user login
passport.use(auth.loginStrategy);
// generate cookie when user login
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// parse cookie when logged in user sent new request
passport.deserializeUser(auth.deserializeUserFunction);

app.get('/sign-up', (req, res)=> {
    res.render('signup');
});

app.post('/sign-up', userController.createUser);

app.get('/login', (req, res) => {
    res.render('login', {user: req.user});
});

app.post('/login', passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login'})
);

app.get('/', folderController.getFolderById)
app.get(`/folders/:folder_id`, folderController.getFolderById);
app.get(`/folders/:folder_id/new`, (req, res) => {
    res.render("addFolder", {parentFolderId: req.params.folder_id});
});
app.post(`/folders/:folder_id/new`, folderController.createFolder);
// app.post(`folders/:folder_id/delete`, folderController.deleteFolder);

app.get(`/files/:file_id`, folderController.getFile);

app.get('/folders/:folder_id/files/new', (req, res) => {
    res.render("addFile", {folder_id: req.params.folder_id});
});
app.post('/folders/:folder_id/files/new', upload.single('file'), folderController.createFile);
app.listen(3000, ()=> console.log(`server started listening to port 3000`));