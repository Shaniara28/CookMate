import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getAIRecommendations, clearRecommendations } from "../store/aiSlice";

const AIRecommendation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { recommendations, loading, error, } = useSelector((state) => state.ai);

    const [ingredients, setIngredients] = useState("");
    const [preferences, setPreferences] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!ingredients.trim()) {
            return;
        }

        dispatch(
            getAIRecommendations({
                ingredients,
                preferences,
            })
        );
    };

    const handleClear = () => {
        setIngredients("");
        setPreferences("");
        dispatch(clearRecommendations());
    };

    const handleViewRecipe = (mealId) => {
        navigate(`/explore-recipe/${mealId}`);
    };

    return (
        <div className="container py-5 mt-5">

            {/* Page Title */}
            <div className="text-center mb-5">
                <h1 className="fw-bold">
                    AI Recipe Recommendation
                </h1>

                <p className="text-muted">
                    Tell CookMate what ingredients you have,
                    and let AI find the best recipes for you.
                </p>
            </div>

            {/* Input Form */}
            <div className="row justify-content-center mb-5">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>

                                {/* Ingredients */}
                                <div className="mb-4">
                                    <label htmlFor="ingredients" className="form-label fw-semibold">
                                        What ingredients do you have?
                                    </label>

                                    <textarea
                                        id="ingredients"
                                        className="form-control"
                                        rows="4"
                                        placeholder="Example: chicken, rice, egg, garlic, soy sauce"
                                        value={ingredients}
                                        onChange={(e) => setIngredients(e.target.value)}
                                    />
                                </div>

                                {/* Preferences */}
                                <div className="mb-4">
                                    <label htmlFor="preferences" className="form-label fw-semibold">
                                        Preferences
                                        <span className="text-muted fw-normal">
                                            {" "}
                                            (optional)
                                        </span>
                                    </label>

                                    <input
                                        id="preferences"
                                        type="text"
                                        className="form-control"
                                        placeholder="Example: quick and easy, spicy, healthy"
                                        value={preferences}
                                        onChange={(e) => setPreferences(e.target.value)}
                                    />
                                </div>

                                {/* Button */}
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-warning flex-grow-1"
                                        disabled={loading || !ingredients.trim()}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-100 d-flex justify-content-center">
                                                    <img src="/image/small-loading.svg" alt="Loading" className="small-loading" />
                                                </div>
                                            </>
                                        ) : (
                                            "Get AI Recommendations"
                                        )}
                                    </button>

                                    {recommendations.length >
                                        0 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleClear}
                                            >
                                                Clear
                                            </button>
                                        )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Result title */}
            {recommendations.length > 0 && (
                <div className="mb-4">
                    <h2 className="fw-bold">
                        Recommended Recipes
                    </h2>

                    <p className="text-muted">
                        Recipes selected by CookMate AI
                        from TheMealDB.
                    </p>
                </div>
            )}

            {/* Recommendation Cards */}
            {recommendations.length > 0 && (
                <div className="row g-4">
                    {recommendations.map((recipe) => (
                        <div className="col-md-6 col-lg-4" key={recipe.meal_id}>
                            <div className="card h-100 border-0 shadow-sm overflow-hidden box">

                                {/* Image */}
                                <img
                                    src={recipe.image}
                                    className="card-img-top"
                                    alt={recipe.recipe_name}
                                    style={{
                                        height: "220px",
                                        objectFit: "cover",
                                    }}
                                />

                                <div className="card-body d-flex flex-column">

                                    {/* Recipe Name */}
                                    <h5 className="card-title fw-bold">
                                        {recipe.recipe_name}
                                    </h5>

                                    {/* Category / Area */}

                                    <div className="mb-3">
                                        {recipe.category && (
                                            <span className="badge bg-light text-dark me-2">
                                                {recipe.category}
                                            </span>
                                        )}

                                        {recipe.area && (
                                            <span className="badge bg-light text-dark">
                                                {recipe.area}
                                            </span>
                                        )}

                                    </div>

                                    {/* Match */}
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <small className="fw-semibold">
                                                Match
                                            </small>

                                            <small className="fw-bold">
                                                {recipe.match_percentage}%
                                            </small>
                                        </div>

                                        <div className="progress" style={{ height: "8px" }}>
                                            <div className="progress-bar" role="progressbar"
                                                style={{
                                                    width: `${recipe.match_percentage}%`,
                                                    backgroundColor: "#EFC81A"
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <p className="card-text text-muted small">
                                        {recipe.reason}
                                    </p>

                                    {/* Available Ingredients */}
                                    {recipe.available_ingredients
                                        ?.length > 0 && (
                                            <div className="mb-3">
                                                <p className="fw-semibold mb-1">
                                                    You have:
                                                </p>

                                                <div className="d-flex flex-wrap gap-1">
                                                    {recipe.available_ingredients.map(
                                                        (ingredient, index) => (
                                                            <span key={index} className="badge bg-success-subtle text-success">
                                                                ✓{" "}
                                                                {ingredient}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Additional Ingredients*/}
                                    {recipe.additional_ingredients?.length > 0 && (
                                        <div className="mb-3">

                                            <p className="fw-semibold mb-1">
                                                You may need:
                                            </p>

                                            <div className="d-flex flex-wrap gap-1">
                                                {recipe.additional_ingredients.slice(0, 5).map(
                                                    (ingredient, index) => (
                                                        <span key={index} className="badge bg-warning-subtle text-dark">
                                                            {ingredient}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* View Recipe */}
                                    <button
                                        type="button"
                                        className="btn btn-warning mt-auto"
                                        onClick={() =>
                                            handleViewRecipe(recipe.meal_id)}
                                    >
                                        View Recipe
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AIRecommendation;