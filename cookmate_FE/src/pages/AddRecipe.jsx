import Banner from "../components/Banner"
import "../style/addRecipe.css"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { addRecipeAsync } from "../store/recipeSlice";

export default function AddRecipe() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { addLoading } = useSelector(
        (state) => state.recipes
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        const recipeData = {
            name,
            description,
            ingredients,
            instructions,
            image,
            category,
        };

        const result = await dispatch(
            addRecipeAsync(recipeData)
        );

        if (result.success) {
            await Swal.fire({
                icon: "success",
                title: "Recipe Added!",
                text: "Your recipe has been created successfully.",
                confirmButtonText: "View Recipes",
            });

            navigate("/");
        } else {
            console.log(result)
            Swal.fire({
                icon: "error",
                title: "Failed to Add Recipe",
                text: result.message,
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <>
            {/*Banner */}
            <Banner />

            <div className="container mb-5">
                <div className="title text-center">
                    <h1>Add New Recipe</h1>
                    <p>Create your new recipe</p>
                </div>
                <form className="w-50 m-auto" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name Recipe
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Example: Spaghetti Carbonara"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            rows="3"
                            placeholder="Enter your food description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ingrdients" className="form-label">
                            Ingredients
                        </label>
                        <textarea
                            id="ingrdients"
                            name="ingrdients"
                            className="form-control"
                            rows="2"
                            placeholder="Enter your food ingrdients"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="instructions" className="form-label">
                            Instructions
                        </label>
                        <textarea
                            id="instructions"
                            name="instructions"
                            className="form-control"
                            rows="5"
                            placeholder="Enter your food instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                            Image Url
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="image"
                            placeholder="Enter your image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">
                            Category
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="category"
                            placeholder="Example: Chicken, Beef, Pasta, etc"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn w-100 btn-yellow">
                        Submit
                    </button>
                </form>
            </div>
        </>
    )
}