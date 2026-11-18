const { Recipe } = require('../models');
const { BadRequestError, NotFoundError } = require('../middlewares/customError');

class RecipeController {
    static async getRecipes(req, res, next) {
        try {
            const recipes = await Recipe.findAll();
            res.status(200).json(recipes);
        }
        catch (error) {
            next(error);
        }
    }

    static async getRecipeById(req, res, next) {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findByPk(id);

            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            res.status(200).json(recipe);
        }
        catch (error) {
            next(error);
        }
    }

    static async getMyRecipe(req, res, next) {
        try {
            const recipes = await Recipe.findAll({ where: { UserId: req.loginInfo.userId } });

            if (!recipes || recipes.length === 0) {
                return res.status(404).json({ message: 'No recipes found for this user' });
            }

            res.status(200).json(recipes);
        }
        catch (error) {
            next(error);
        }
    }

    static async createRecipe(req, res, next) {
        try {
            const { userId } = req.loginInfo;

            const { name, description, ingredients, instructions, image, category } = req.body;

            if (!name || !description || !ingredients || !instructions || !image || !category) {
                throw new BadRequestError('All fields are required');
            }

            const recipe = await Recipe.create({ name, description, ingredients, instructions, image, category, UserId: userId });

            res.status(201).json(recipe);
        }
        catch (error) {
            next(error);
        }
    }

    static async updateRecipe(req, res, next) {
        try {
            const { id } = req.params;
            const { name, description, ingredients, instructions, image, category } = req.body;

            if (!name || !description || !ingredients || !instructions || !image || !category) {
                throw new BadRequestError('All fields are required');
            }

            const recipe = await Recipe.findByPk(id);

            if (!recipe) {
                throw new NotFoundError('Recipe not found');
            }

            const data = await recipe.update({ name, description, ingredients, instructions, image, category });

            res.status(200).json(data);
        }
        catch (error) {
            next(error);
        }
    }

    static async deleteRecipe(req, res, next) {
        try {
            const { id } = req.params;

            const recipe = await Recipe.findByPk(id);

            if (!recipe) {
                throw new NotFoundError('Recipe not found');
            }

            await recipe.destroy();

            res.status(200).json({ message: `Recipe ${recipe.name} deleted successfully` });
        }
        catch (error) {
            next(error);
        }
    }
}

module.exports = RecipeController;
