import { Link } from "react-router";
import formatTimeAgo from "../helpers/formatTimeAgo";
import { useDispatch } from "react-redux";
import { unsaveRecipeAsync } from "../store/savedSlice";
import Swal from "sweetalert2";

export default function SavedRecipeCard({ savedRecipe }) {

    const dispatch = useDispatch();

    const recipe = savedRecipe.Recipe;

    const handleUnsave = async () => {

        const result = await Swal.fire({
            icon: "warning",
            title: "Unsave Recipe?",
            text: `Remove "${recipe.name}" from your saved recipes?`,
            showCancelButton: true,
            confirmButtonText: "Yes, unsave it",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        const response = await dispatch(
            unsaveRecipeAsync(savedRecipe.id)
        );

        if (response.success) {
            Swal.fire({
                icon: "success",
                title: "Recipe Unsaved",
                text: "The recipe has been removed from your saved recipes.",
                confirmButtonText: "OK",
            });

        } else {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: response.message,
                confirmButtonText: "OK",
            });

        }
    };

    return (
        <div className="col-12 col-sm-6 col-lg-3">
            <div className="recipe-card">
                <div className="recipe-image-wrapper">
                    <Link to={`/detail-recipe/${recipe.id}`} className="d-block" >
                        <img src={recipe.image || "/image/default-food.png"}
                            alt={recipe.name}
                            className="recipe-image"
                            onError={(e) => { e.currentTarget.src = "/image/default-food.png"; }}
                        />
                    </Link>

                    <div className="recipe-actions">
                        <button type="button"
                            className="recipe-action delete border border-warning shadow"
                            onClick={handleUnsave}
                        >
                            <i className="bi bi-bookmark-x-fill"></i>
                        </button>
                    </div>
                </div>

                <Link to={`/detail-recipe/${recipe.id}`} className="text-decoration-none">
                    <div className="recipe-info">
                        <h6 className="recipe-name">
                            {recipe.name}
                        </h6>
                        <div className="recipe-meta">
                            <span>
                                <i className="bi bi-clock"></i>
                                {formatTimeAgo(recipe.createdAt)}
                            </span>

                            <span>
                                <i className="bi bi-fork-knife"></i>
                                {recipe.category}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}