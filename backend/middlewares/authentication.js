const UnauthorizedError = require('./customError').UnauthorizedError;
const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

async function authentication(req, res, next) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw new UnauthorizedError('Please login first');
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedError('Invalid token format');
        }

        const payload = verifyToken(token);

        const user = await User.findByPk(payload.id);

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        req.loginInfo = {
            userId: user.id,
            name: user.name,
            email: user.email,
        };

        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = authentication