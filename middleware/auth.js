const session = require("express-session");
const bcrypt = require("bcrypt");
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const LocalStrategy = require('passport-local').Strategy;
const userController = require("../controllers/userController");

const sessionManager = () => {
    return session({
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
    )})
};
const loginStrategy =  new LocalStrategy(async(username, password, done) => {
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
    });

const deserializeUserFunction = async (id, done) => {
    try {
        const user = await userController.getUserById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
}
module.exports = {
    sessionManager,
    loginStrategy,
    deserializeUserFunction
}

