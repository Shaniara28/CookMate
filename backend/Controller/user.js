const { User } = require('../models')
const { NotFoundError, BadRequestError } = require("../middlewares/customError");

class UserController {
    static async getCurrentUser(req, res, next) {
        try {
            const { userId } = req.loginInfo;

            const user = await User.findByPk(userId, {
                attributes: [
                    "id",
                    "name",
                    "email",
                    "imageProfile"
                ]
            });

            if (!user) {
                throw new NotFoundError("User not found");
            }

            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async updateCurrentUser(req, res, next) {
        try {
            const { userId } = req.loginInfo;
            const { name, imageProfile } = req.body;

            if (!name) {
                throw new BadRequestError("Name is required");
            }

            const user = await User.findByPk(userId);

            if (!user) {
                throw new NotFoundError("User not found");
            }

            await user.update({
                name,
                imageProfile
            });

            const updatedUser = await User.findByPk(userId, {
                attributes: [
                    "id",
                    "name",
                    "email",
                    "imageProfile"
                ]
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = UserController