const db = require("../prisma/script");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
    const body = req.body;
    const hashedPw = await bcrypt.hash(body.password, 10);
    const createReq = {
        username: body.username,
        password: hashedPw
    }
    console.log(`usename is ${JSON.stringify(createReq)}`);
    await db.createUser(createReq);
    res.redirect('/');
}

async function getUserByName(req) {
    return await db.getUserByName(req);
}
async function getUserById(id) {
    return await db.getUserById(id);
}

module.exports = {
    createUser,
    getUserByName,
    getUserById
}