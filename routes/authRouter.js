const express = require('express');
const passport = require('passport');
const auth = require("../middleware/auth");
const userController = require('../controllers/userController');

const router = express.Router();

// for user login
passport.use(auth.loginStrategy);
// generate cookie when user login
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// parse cookie when logged in user sent new request
passport.deserializeUser(auth.deserializeUserFunction);


// Sign up routes
router.get('/sign-up', (req, res) => {
    res.render('signup');
});

router.post('/sign-up', userController.createUser);

// Login routes
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');  // Redirect to login page after logout
    });
});

module.exports = router;
