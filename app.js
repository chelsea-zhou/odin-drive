const express = require("express");
const folderController = require("./controllers/folderController");
const userController = require("./controllers/userController");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.use(
    session({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: 'a santa at nasa',
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
);
app.use(passport.session());

// for user login
passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const user = await userController.getUserByName({username});
            if (!user) {
                return done(null, false, {message: "incorrect username"});
            }
            const isEqualPw = await bcrypt.compare(password, user.password);
            if (!isEqualPw) {
                return done(null, false, {message: "incorrect password"});
            }
            return done(null, user);
        } catch(err){
            return done(err);
        }
    })

);

// generate cookie when user login
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// parse cookie when logged in user sent new request
passport.deserializeUser(async (id, done) => {
    try {
        console.log(`id is ${id}`);
        const user = await userController.getUserById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

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

// app.get(`/folders/:folder_id/files/:fild_id`, folderController.getFile);

app.get('/folders/:folder_id/files/new', (req, res) => {
    res.render("addFile", {folder_id: req.params.folder_id});
});
app.post('/folders/:folder_id/files/new', folderController.createFile);
app.listen(3000, ()=> console.log(`server started listening to port 3000`));