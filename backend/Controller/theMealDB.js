const { BadRequestError, NotFoundError } = require('../middlewares/customError');

const BASE_URL = process.env.THEMEALDB_BASE_URL;
const API_KEY = process.env.THEMEALDB_API_KEY;

async function fetchTheMealDB(endpoint) {
    const url = `${BASE_URL}/${API_KEY}/${endpoint}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch data from TheMealDB');
    }

    return response.json();
}

class TheMealDBController {

    // GET /external-recipes/search?query=chicken
    static async searchRecipes(req, res, next) {
        try {
            const { query } = req.query;

            if (!query) {
                throw new BadRequestError('Search query is required');
            }

            const data = await fetchTheMealDB(`search.php?s=${encodeURIComponent(query)}`);

            res.status(200).json(data.meals || []);
        }
        catch (error) {
            next(error);
        }
    }

    // GET /external-recipes/:id
    static async getRecipeById(req, res, next) {
        try {
            const { id } = req.params;

            const data = await fetchTheMealDB(`lookup.php?i=${encodeURIComponent(id)}`);

            if (!data.meals) {
                throw new NotFoundError('External recipe not found');
            }

            res.status(200).json(data.meals[0]);
        }
        catch (error) {
            next(error);
        }
    }

    // GET /external-recipes/categories
    static async getCategories(req, res, next) {
        try {
            const data = await fetchTheMealDB('categories.php');

            res.status(200).json(data.categories || []);
        }
        catch (error) {
            next(error);
        }
    }

    // GET /external-recipes/filter?type=category&value=Seafood
    static async filterRecipes(req, res, next) {
        try {
            const { type, value } = req.query;

            if (!type || !value) {
                throw new BadRequestError(
                    'Filter type and value are required'
                );
            }

            const allowedTypes = ['category', 'area', 'ingredient'];

            if (!allowedTypes.includes(type)) {
                throw new BadRequestError(
                    'Filter type must be category, area, or ingredient'
                );
            }

            let endpoint;

            if (type === 'category') {
                endpoint = `filter.php?c=${encodeURIComponent(value)}`;
            }

            if (type === 'area') {
                endpoint = `filter.php?a=${encodeURIComponent(value)}`;
            }

            if (type === 'ingredient') {
                endpoint = `filter.php?i=${encodeURIComponent(value)}`;
            }

            const data = await fetchTheMealDB(endpoint);

            res.status(200).json(data.meals || []);
        }
        catch (error) {
            next(error);
        }
    }
}

module.exports = TheMealDBController;