import Banner from "../components/Banner";
import ProfileCard from "../components/ProfileCard";
import "../style/profile.css";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react"
import { getMyRecipeAsync } from "../store/recipeSlice";
import { useState } from "react";
import { getSavedRecipesAsync } from "../store/savedSlice";
import SavedRecipeCard from "../components/SavedRecipeCard";
import { useNavigate } from "react-router";

function Profile() {
    const [activeTab, setActiveTab] = useState("myRecipe");

    const { user } = useSelector((state) => state.auth);
    const { myRecipes, myRecipeLoading, myRecipeError } = useSelector(state => state.recipes)
    const { savedRecipes, loading: savedLoading, error: savedError } = useSelector((state) => state.savedRecipes);

    const dispatch = useDispatch()
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getMyRecipeAsync());
    }, [dispatch]);

    const handleSavedRecipe = () => {
        setActiveTab("savedRecipe");
        dispatch(getSavedRecipesAsync());
    };

    return (
        <div className="profile-page">

            {/* Banner */}
            <Banner />

            {/* Profile */}
            <div className="profile-info">
                <div className="profile-photo-wrapper">
                    <img
                        src={user?.imageProfile || "/image/profile-default.jpg"}
                        alt="Profile"
                        className="profile-photo"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/image/profile-default.jpg";
                        }}
                    />
                    <button className="edit-profile-button"
                        onClick={() => navigate("/update-profile")}
                    >
                        <i className="bi bi-pencil-fill"></i>
                    </button>
                </div>
                <h5 className="profile-name">
                    Shania Risky Agustin
                </h5>
            </div>

            <div className="container">
                {/* Tabs */}
                <div className="profile-tabs">
                    <button
                        className={`profile-tab ${activeTab === "myRecipe" ? "active" : ""}`}
                        onClick={() => setActiveTab("myRecipe")}
                    >
                        My Recipe
                    </button>

                    <button
                        className={`profile-tab ${activeTab === "savedRecipe" ? "active" : ""}`}
                        onClick={() => {
                            setActiveTab("savedRecipe");
                            dispatch(getSavedRecipesAsync());
                        }}
                    >
                        Saved Recipe
                    </button>
                </div>

                {/* Recipe List */}
                <div className="recipe-list">

                    {/* MY RECIPE */}
                    {activeTab === "myRecipe" && (
                        <>
                            {myRecipeLoading && (
                                <div className="w-100 d-flex justify-content-center">
                                    <img src="/image/loading.svg" alt="Loading" className="loading" />
                                </div>
                            )}

                            {!myRecipeLoading &&
                                !myRecipeError &&
                                myRecipes.length === 0 && (
                                    <div className="text-center py-5">
                                        <i className="bi bi-journal-x"
                                            style={{
                                                fontSize: "45px",
                                                color: "#f4c400"
                                            }}
                                        ></i>

                                        <h5 className="mt-3">
                                            You don't have any recipes yet
                                        </h5>

                                        <p className="text-muted">
                                            Start creating your own recipe and
                                            it will appear here.
                                        </p>
                                    </div>
                                )}

                            {!myRecipeLoading &&
                                !myRecipeError &&
                                myRecipes.length > 0 && (
                                    <div className="row g-3">
                                        {myRecipes.map((recipe) => (
                                            <ProfileCard key={recipe.id} recipe={recipe} />
                                        ))}
                                    </div>
                                )}
                        </>
                    )}


                    {/* SAVED RECIPE */}
                    {activeTab === "savedRecipe" && (
                        <>
                            {savedLoading && (
                                <div className="w-100 d-flex justify-content-center">
                                    <img src="/image/loading.svg" alt="Loading" className="loading" />
                                </div>
                            )}

                            {!savedLoading &&
                                !savedError &&
                                savedRecipes.length === 0 && (
                                    <div className="text-center py-5">
                                        <i className="bi bi-bookmark-x"
                                            style={{
                                                fontSize: "45px",
                                                color: "#f4c400"
                                            }}
                                        ></i>

                                        <h5 className="mt-3">
                                            You don't have any saved recipes
                                        </h5>

                                        <p className="text-muted">
                                            Recipes you save will appear here.
                                        </p>
                                    </div>
                                )}

                            {!savedLoading &&
                                !savedError &&
                                savedRecipes.length > 0 && (
                                    <div className="row g-3">
                                        {savedRecipes.map((savedRecipe) => (
                                            <SavedRecipeCard key={savedRecipe.id} savedRecipe={savedRecipe}
                                            />
                                        ))}
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;