import { useEffect } from "react"
import HomeCard from "../components/HomeCard"
import "../style/home.css"
import { useSelector, useDispatch } from 'react-redux'
import { fetchAsync } from "../store/recipeSlice"
import Swal from "sweetalert2";

export default function Home() {

    const { recipes, loading, error } = useSelector(state => state.recipes)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAsync());
    }, [])

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error,
                confirmButtonText: "OK",
            });
        }
    }, [error]);

    return (
        <>
            <section className="hero-section mt-5">

                {/* Yellow Background */}
                <div className="hero-yellow"></div>

                {/* Dot Pattern */}
                <img
                    src="/image/dot-pattern.png"
                    className="hero-dots"
                />

                <div className="container hero-container">
                    <div className="row align-items-center">

                        {/* Left */}
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <h1>
                                    Discover Recipe
                                    <br />
                                    & Delicious Food
                                </h1>
                                {/* <div className="hero-search">
                                    <i className="bi bi-search"></i>
                                    <input type="text" placeholder="Search Recipe" />
                                </div> */}
                            </div>
                        </div>

                        {/* Right */}
                        <div className="col-lg-6">
                            <div className="hero-image-wrapper">
                                <img src="/image/food.png" alt="Delicious food" className="hero-food" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recipe List */}
            <section className="list-recipe-section">
                <div className="container">

                    {/* Section Title */}
                    <div className="list-recipe-title">
                        <h2>Recipe List</h2>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="w-100 d-flex justify-content-center">
                            <img src="/image/loading.svg" alt="Loading" className="loading" />
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="text-center py-5">
                            <i className="bi bi-exclamation-circle"
                                style={{
                                    fontSize: "45px",
                                    color: "#dc3545"
                                }}
                            ></i>

                            <h5 className="mt-3">
                                Something went wrong
                            </h5>

                            <p className="text-danger">
                                {error}
                            </p>

                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        !error &&
                        recipes.length === 0 && (

                            <div className="text-center py-5">
                                <i className="bi bi-journal-x"
                                    style={{
                                        fontSize: "45px",
                                        color: "#f4c400"
                                    }}
                                ></i>

                                <h5 className="mt-3">
                                    No recipes available yet
                                </h5>

                                <p className="text-muted">
                                    There are no recipes to explore at the moment.
                                </p>
                            </div>
                        )}

                    {/* Recipes */}
                    {!loading &&
                        !error &&
                        recipes.length > 0 && (
                            <div className="row">
                                {recipes.map((recipe) => (
                                    <HomeCard
                                        recipe={recipe}
                                        key={recipe.id}
                                    />
                                ))}
                            </div>
                        )}
                </div>
            </section>
        </>
    )
}