import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getExternalRecipeDetail, clearRecipeDetail } from "../store/externalRecipeSlice";

export default function ExternalRecipeDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recipeDetail, loading, error } = useSelector(
        (state) => state.externalRecipe
    );

    useEffect(() => {
        dispatch(
            getExternalRecipeDetail(id)
        );
        return () => {
            dispatch(clearRecipeDetail());
        };
    }, [dispatch, id]);


    if (loading) {
        return (
            <div className="w-100 d-flex justify-content-center">
                <img src="/image/loading.svg" alt="Loading" className="loading" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 pt-5">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    if (!recipeDetail) {
        return null;
    }

    return (
        <div className="container my-5 pt-5">
            <div className="row g-4">

                {/* Image */}
                <div className="col-12 col-lg-6 d-flex justify-content-center">
                    <img
                        src={recipeDetail.strMealThumb}
                        alt={recipeDetail.strMeal}
                        className="img-fluid rounded-4 shadow-sm"
                        style={{ height: "500px", objectFit: "cover" }}
                    />
                </div>

                {/* Information */}
                <div className="col-12 col-lg-6">
                    <h1>
                        {recipeDetail.strMeal}
                    </h1>

                    <div className="d-flex gap-2 mb-4">
                        <span className="badge text-bg-warning">
                            {recipeDetail.strCategory}
                        </span>

                        <span className="badge text-bg-secondary">
                            {recipeDetail.strArea}
                        </span>
                    </div>

                    <h3>
                        Instructions
                    </h3>

                    <p style={{ lineHeight: "1.8" }}>
                        {recipeDetail.strInstructions}
                    </p>

                    {recipeDetail.strYoutube && (
                        <a
                            href={recipeDetail.strYoutube}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-danger"
                        >
                            Watch Tutorial
                        </a>
                    )}
                </div>
            </div>

            {/* Ingredients */}
            <div className="mt-5">
                <h2>
                    Ingredients
                </h2>

                <ul className="list-group">
                    {Array.from({ length: 20 }).map((_, index) => {
                        const ingredient = recipeDetail[
                            `strIngredient${index + 1}`
                        ];

                        const measure = recipeDetail[
                            `strMeasure${index + 1}`
                        ];


                        if (!ingredient?.trim()) {
                            return null;
                        }

                        return (
                            <li key={index} className="list-group-item">
                                <strong> {ingredient} </strong>
                                {" - "}
                                {measure}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}