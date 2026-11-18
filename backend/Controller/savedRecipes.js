const { User, SavedRecipe, Recipe } = require('../models');
const { NotFoundError, BadRequestError } = require('../middlewares/customError');

class SavedRecipesController {
    static async getSavedRecipes(req, res, next) {
        try {
            const { userId } = req.loginInfo;

            const savedRecipes = await SavedRecipe.findAll({
                where: { UserId: userId },
                include: [{ model: Recipe }]
            });

            res.status(200).json(savedRecipes);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async createSavedRecipe(req, res, next) {
        try {
            const { userId } = req.loginInfo;
            const { RecipeId } = req.body;

            if (!RecipeId) {
                throw new BadRequestError('RecipeId is required');
            }

            const existingSavedRecipe = await SavedRecipe.findOne({
                where: {
                    UserId: userId,
                    RecipeId
                }
            });

            if (existingSavedRecipe) {
                throw new BadRequestError('Recipe has already been saved');
            }

            const savedRecipe = await SavedRecipe.create({
                UserId: userId,
                RecipeId
            });

            res.status(201).json(savedRecipe);
        } catch (error) {
            next(error);
        }
    }

    static async deleteSavedRecipe(req, res, next) {
        try {
            const { id } = req.params;

            const savedRecipe = await SavedRecipe.findByPk(id);

            if (!savedRecipe) {
                throw new NotFoundError('Saved recipe is not found');
            }

            await savedRecipe.destroy();
            res.status(200).json({ message: 'Saved recipe deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}

module.exports = SavedRecipesController;