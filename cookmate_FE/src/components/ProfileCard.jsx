import formatTimeAgo from "../helpers/formatTimeAgo";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { deleteRecipeAsync } from "../store/recipeSlice";

export default function ProfileCard({ recipe }) {

    const dispatch = useDispatch();

    const handleDelete = async () => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Delete Recipe?",
            text: `Are you sure you want to delete "${recipe.name}"?`,
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
            return;
        }

        const response = await dispatch(
            deleteRecipeAsync(recipe.id)
        );

        if (response.success) {
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Your recipe has been deleted successfully.",
                confirmButtonText: "OK",
            });

        } else {
            Swal.fire({
                icon: "error",
                title: "Failed to Delete",
                text: response.message,
                confirmButtonText: "OK",
            });

        }
    };

    return (
        <div className="col-12 col-sm-6 col-lg-3">

            <div className="recipe-card">

                {/* Image */}
                <div className="recipe-image-wrapper">

                    <Link to={`/detail-recipe/${recipe.id}`} className="d-block">
                        <img src={recipe.image || "/image/default-food.png"}
                            alt={recipe.name}
                            className="recipe-image"
                            onError={(e) => { e.currentTarget.src = "/image/default-food.png"; }}
                        />
                    </Link>


                    {/* Action Buttons */}
                    <div className="recipe-actions">
                        <Link to={`/edit-recipe/${recipe.id}`} className="recipe-action edit border border-warning shadow">
                            <i className="bi bi-pencil-fill"></i>
                        </Link>

                        <button type="button"
                            className="recipe-action delete border border-warning shadow"
                            onClick={handleDelete}
                        >
                            <i className="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </div>


                {/* Recipe Info */}
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