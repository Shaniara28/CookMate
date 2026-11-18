const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET

function signToken(payload) {
    const token = jwt.sign(payload, secretKey)
    return token;
}

function verifyToken(token) {
    return jwt.verify(token, secretKey)
}

module.exports = { signToken, verifyToken }