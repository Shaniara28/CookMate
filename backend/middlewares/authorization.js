const { Recipe, SavedRecipe } = require('../models');
const { NotFoundError, UnauthorizedError } = require('../middlewares/customError');

async function authZRecipe(req, res, next) {
    try {
        const { userId } = req.loginInfo;
        const { id } = req.params;

        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            throw new NotFoundError('Recipe not found');
        }

        if (recipe.UserId !== userId) {
            throw new UnauthorizedError('You are not authorized to perform this action');
        }

        next();
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

async function authZSavedRecipe(req, res, next) {
    try {
        const { userId } = req.loginInfo;
        const { id } = req.params;

        const savedRecipe = await SavedRecipe.findByPk(id);

        if (!savedRecipe) {
            throw new NotFoundError('Saved recipe not found');
        }

        if (savedRecipe.UserId !== userId) {
            throw new UnauthorizedError('You are not authorized to perform this action');
        }

        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    authZRecipe,
    authZSavedRecipe
};