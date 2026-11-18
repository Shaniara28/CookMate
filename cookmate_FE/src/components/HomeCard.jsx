import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { saveRecipeAsync } from "../store/savedSlice";
import Swal from "sweetalert2";

export default function HomeCard({ recipe }) {

    const dispatch = useDispatch();

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const result = await dispatch(
            saveRecipeAsync(recipe.id)
        );

        if (result.success) {
            Swal.fire({
                icon: "success",
                title: "Recipe Saved!",
                text: "Recipe has been added to your saved recipes.",
                confirmButtonText: "OK",
            });

        } else {
            Swal.fire({
                icon: "error",
                title: "Failed to Save",
                text: result.message,
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <>
            <div className="col-12 col-md-6 col-lg-4 mt-4">
                <Link to={`/detail-recipe/${recipe.id}`}>
                    <div className="list-recipe-card shadow">
                        <img
                            src={recipe.image || "/image/default-food.png"}
                            onError={(e) => {
                                e.currentTarget.src = "/image/default-food.png";
                            }}
                            alt={recipe.name}
                            className="list-recipe-image"
                        />

                        <div className="list-recipe-overlay"></div>

                        {/* Save Recipe */}
                        <button className="save-recipe-button" onClick={handleSave}>
                            <i className="bi bi-bookmark"></i>
                        </button>

                        <h3 className="list-recipe-name">
                            {recipe.name}
                        </h3>
                    </div>
                </Link>
            </div>
        </>
    )
}