import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
    searchExternalRecipes,
    getExternalCategories,
    filterExternalRecipes
} from "../store/externalRecipeSlice";

export default function ExploreRecipes() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { recipes, categories, loading, error } = useSelector((state) => state.externalRecipe);

    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(searchExternalRecipes("chicken"));
        dispatch(getExternalCategories());
    }, [dispatch]);

    function handleSearch(e) {
        e.preventDefault();
        if (!search.trim()) return;
        dispatch(searchExternalRecipes(search));
    }

    function handleCategoryChange(e) {
        const category = e.target.value;

        if (!category) {
            dispatch(searchExternalRecipes("chicken"));
            return;
        }

        dispatch(
            filterExternalRecipes({
                type: "category",
                value: category
            })
        );
    }

    return (
        <div className="container my-5 pt-5">
            <div className="text-center mb-4">
                <h1>Explore Recipes</h1>
                <p className="text-muted">
                    Discover recipes from around the world
                </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search recipe..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button type="submit" className="btn btn-warning">
                    Search
                </button>
            </form>

            {/* Category */}
            <div className="mb-4">
                <select
                    className="form-select"
                    onChange={handleCategoryChange}
                >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                        <option key={category.idCategory} value={category.strCategory}>
                            {category.strCategory}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="w-100 d-flex justify-content-center">
                    <img src="/image/loading.svg" alt="Loading" className="loading" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {/* Recipes */}
            {!loading && (
                <div className="row g-4">

                    {recipes.map((recipe) => (
                        <div className="col-12 col-md-6 col-lg-4" key={recipe.idMeal}>

                            <div className="card h-100 shadow-sm">
                                <img
                                    src={recipe.strMealThumb}
                                    className="card-img-top"
                                    alt={recipe.strMeal}
                                    style={{ height: "250px", objectFit: "cover" }}
                                />

                                <div className="card-body">
                                    <h5 className="card-title">
                                        {recipe.strMeal}
                                    </h5>

                                    {recipe.strCategory && (
                                        <span className="badge text-bg-warning">
                                            {recipe.strCategory}
                                        </span>
                                    )}

                                    {recipe.strArea && (
                                        <p className="text-muted mt-2 mb-3">
                                            {recipe.strArea}
                                        </p>
                                    )}

                                    <button
                                        className="btn btn-dark w-100"
                                        onClick={() => navigate(`/explore-recipe/${recipe.idMeal}`)}
                                    >
                                        View Recipe
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && recipes.length === 0 && (
                <div className="text-center mt-5">
                    <p>
                        No recipes found.
                    </p>
                </div>
            )}
        </div>
    );
}