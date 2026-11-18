const { GoogleGenAI } = require("@google/genai");
const { BadRequestError } = require("../middlewares/customError");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const getMealDBRecipes = async (ingredients) => {
    const apiKey = process.env.THEMEALDB_API_KEY;
    const baseUrl = process.env.THEMEALDB_BASE_URL;

    const ingredientList = ingredients
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);

    const mealMap = new Map();

    for (const ingredient of ingredientList) {
        const response = await fetch(
            `${baseUrl}/${apiKey}/filter.php?i=${encodeURIComponent(ingredient)}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch recipes from TheMealDB");
        }

        const data = await response.json();

        if (data.meals) {
            data.meals.forEach((meal) => {
                if (mealMap.has(meal.idMeal)) {
                    mealMap.get(meal.idMeal).matchCount += 1;
                } else {
                    mealMap.set(meal.idMeal, {
                        ...meal,
                        matchCount: 1,
                    });
                }
            });
        }
    }

    return Array.from(mealMap.values()).sort((a, b) => b.matchCount - a.matchCount);
};

const getMealDetails = async (mealId) => {
    const apiKey = process.env.THEMEALDB_API_KEY;
    const baseUrl = process.env.THEMEALDB_BASE_URL;

    const response = await fetch(`${baseUrl}/${apiKey}/lookup.php?i=${mealId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch recipe details from TheMealDB");
    }

    const data = await response.json();

    return data.meals?.[0] || null;
};

const extractIngredients = (meal) => {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure?.trim() || "",
            });
        }
    }

    return ingredients;
};

class GeminiController {
    static async recommendRecipes(req, res, next) {
        try {
            const { ingredients, preferences } = req.body;

            if (!ingredients) {
                throw new BadRequestError("Ingredients are required");
            }

            if (typeof ingredients !== "string" || !ingredients.trim()) {
                throw new BadRequestError(
                    "Ingredients must be a non-empty string"
                );
            }

            const meals = await getMealDBRecipes(ingredients);

            if (!meals.length) {
                return res.status(404).json({
                    message: "No recipes found from TheMealDB based on your ingredients",
                });
            }

            const candidateMeals = meals.slice(0, 10);

            const detailedMeals = await Promise.all(
                candidateMeals.map((meal) =>
                    getMealDetails(meal.idMeal)
                )
            );

            const validMeals = detailedMeals.filter(Boolean);

            if (!validMeals.length) {
                return res.status(404).json({
                    message: "Recipe details could not be retrieved from TheMealDB",
                });
            }

            const candidates = validMeals.map((meal) => ({
                meal_id: meal.idMeal,
                recipe_name: meal.strMeal,
                category: meal.strCategory,
                area: meal.strArea,
                ingredients: extractIngredients(meal),
            }));

            const prompt = `
You are CookMate AI, an AI recipe recommendation system.

The user has the following ingredients:

${ingredients}

User preferences:

${preferences || "None"}

Below is a list of recipes retrieved directly from TheMealDB.

IMPORTANT RULES:

1. You MUST ONLY recommend recipes from the provided list.
2. DO NOT invent recipes.
3. DO NOT create new recipe names.
4. DO NOT invent meal IDs.
5. Compare the user's ingredients with the recipe ingredients.
6. Calculate a realistic match percentage.
7. Recommend the 3 recipes that best match the user's ingredients.
8. Explain why each recipe matches.
9. Mention which user ingredients are available.
10. Mention which additional ingredients are needed.

TheMealDB recipes:

${JSON.stringify(candidates, null, 2)}

Return exactly 3 recommendations if at least 3 recipes are available.
`;

            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "object",
                        properties: {
                            recommendations: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        meal_id: {
                                            type: "string",
                                        },
                                        recipe_name: {
                                            type: "string",
                                        },
                                        match_percentage: {
                                            type: "integer",
                                        },
                                        reason: {
                                            type: "string",
                                        },
                                        available_ingredients: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                        additional_ingredients: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                        },
                                    },
                                    required: [
                                        "meal_id",
                                        "recipe_name",
                                        "match_percentage",
                                        "reason",
                                        "available_ingredients",
                                        "additional_ingredients",
                                    ],
                                },
                            },
                        },
                        required: ["recommendations"],
                    },
                },
            });

            const result = JSON.parse(response.text);

            const recommendations = result.recommendations
                .map((recommendation) => {
                    const meal = validMeals.find((item) =>
                        item.idMeal === recommendation.meal_id
                    );

                    if (!meal) {
                        return null;
                    }

                    return {
                        meal_id: meal.idMeal,
                        recipe_name: meal.strMeal,
                        image: meal.strMealThumb,
                        category: meal.strCategory,
                        area: meal.strArea,
                        match_percentage:
                            recommendation.match_percentage,
                        reason: recommendation.reason,
                        available_ingredients:
                            recommendation.available_ingredients,
                        additional_ingredients:
                            recommendation.additional_ingredients,
                    };
                })
                .filter(Boolean);

            res.status(200).json({
                recommendations,
            });
        } catch (error) {
            if (error.status === 402) {
                return res.status(402).json({
                    message: "Gemini AI is currently unavailable because the API billing or credit limit has been reached.",
                });
            }

            if (error.status === 503) {
                return res.status(503).json({
                    message: "Gemini AI is temporarily unavailable. Please try again shortly.",
                });
            }

            if (error.status === 429) {
                return res.status(429).json({
                    message: "Gemini AI request limit has been reached. Please try again later.",
                });
            }

            next(error);
        }
    }
}

module.exports = GeminiController;