const { User } = require('../models');
const validator = require("email-validator");
const { comparePassword } = require('../helpers/bcrypt');
const { signToken, verifyToken } = require('../helpers/jwt');
const { hashPassword } = require('../helpers/bcrypt');
const { BadRequestError, UnauthorizedError } = require('../middlewares/customError');
const { OAuth2Client } = require('google-auth-library');

class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password, imageProfile } = req.body;

            if (!name || !email || !password) {
                throw new BadRequestError('Name, email, and password are required');
            }

            const isValidEmail = validator.validate(email);

            if (!isValidEmail) {
                throw new BadRequestError('Invalid email format');
            }

            if (password.length < 5) {
                throw new BadRequestError('Password must be at least 5 characters long');
            }

            const findUser = await User.findOne({ where: { email } });

            if (findUser) {
                throw new BadRequestError('Email already exists');
            }

            const user = await User.create({
                name, email,
                password: hashPassword(password),
                imageProfile: imageProfile || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            });

            delete user.dataValues.password;

            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new BadRequestError('Email and password are required');
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new UnauthorizedError('Invalid email or password');
            }

            const isPasswordValid = comparePassword(password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedError('Invalid email or password');
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
            };

            const access_token = signToken(payload);

            res.status(200).json({ access_token });
        }
        catch (error) {
            next(error);
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const client = new OAuth2Client();

            const { token } = req.headers

            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const gPayload = ticket.getPayload();

            if (!gPayload.email) {
                throw new UnauthorizedError('Unauthorized');
            }

            const [user, created] = await User.findOrCreate({
                where: { email: gPayload.email },
                defaults: {
                    name: gPayload.given_name,
                    email: gPayload.email,
                    password: "",
                    imageProfile: gPayload.picture
                },
            });

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
            };

            const access_token = signToken(payload);

            res.status(200).json({ access_token });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = AuthController;