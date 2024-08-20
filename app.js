const express = require("express");
const path = require('path');
const auth = require("./middleware/auth");
const passport = require('passport');
const userRouter = require('./routes/authRouter');
const folderRouter = require('./routes/folderRouter');

const app = express();

app.set("view engine", "ejs");
// Set the public directory to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use(auth.sessionManager());
app.use(passport.session());

app.use('/', userRouter);
app.use('/', folderRouter);

app.listen(3000, ()=> console.log(`server started listening to port 3000`));