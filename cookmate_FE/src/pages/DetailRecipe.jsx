import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchDetailAsync } from "../store/recipeSlice";
import "../style/detailRecipe.css";
import Banner from "../components/Banner";

export default function DetailRecipe() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { detailRecipe, detailLoading, detailError, } = useSelector((state) => state.recipes);

    useEffect(() => {
        dispatch(fetchDetailAsync(id));
    }, []);

    if (detailLoading) {
        return (
            <div className="container py-5 d-flex justify-content-center align-items-center loadingvh">
                <img src="/image/loading.svg" alt="Loading" className="loading" />
            </div>
        );
    }

    if (detailError) {
        return (
            <div className="container py-5 d-flex justify-content-center align-items-center loadingvh">
                <img src="/image/notfound.png" alt="notfound" className="not-found" />
            </div>
        );
    }

    if (!detailRecipe) {
        return null;
    }

    return (
        <>
            <Banner />

            <div className="container py-5">
                <div className="row g-5">

                    {/* image */}
                    <div className="col-lg-6">
                        <img src={detailRecipe.image || "/image/default-food.png"}
                            alt={detailRecipe.name}
                            className="img-fluid rounded-4 w-100 box"
                            style={{ maxHeight: "450px", objectFit: "cover", }}
                            onError={(e) => { e.currentTarget.src = "/image/default-food.png"; }}
                        />
                    </div>

                    {/* Information */}
                    <div className="col-lg-6">
                        <div className="mb-3">
                            {detailRecipe.category && (
                                <span className="badge bg-warning text-dark me-2">
                                    {detailRecipe.category}
                                </span>
                            )}
                        </div>

                        <h1 className="fw-bold mb-3">
                            {detailRecipe.name}
                        </h1>

                        {/* Description */}
                        <p className="text-muted">
                            {detailRecipe.description}
                        </p>

                        {/* Ingredients */}
                        <div className="mt-4">
                            <h3 className="fw-bold mb-3"> Ingredients </h3>
                            <div className="recipe-ingredients">
                                {detailRecipe.ingredients?.split(",").map((ingredient, index) => (
                                    <div key={index} className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        {ingredient.trim()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instruction */}
                <div className="row mt-5">
                    <div className="col-12">
                        <h2 className="fw-bold mb-4"> Instructions </h2>
                        <div className="recipe-instructions">
                            {detailRecipe.instructions?.split(".").map((instruction, index) =>
                            (instruction.trim() && (
                                <div key={index} className="mb-3">
                                    <div className="d-flex gap-3">
                                        <div className="rounded-circle bg-warning d-flex justify-content-center align-items-center"
                                            style={{ minWidth: "35px", height: "35px", }}>
                                            {index + 1}
                                        </div>
                                        <p className="mb-0">{instruction.trim()}.</p>
                                    </div>
                                </div>
                            )))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}