import "../style/banner.css"

export default function Banner() {
    return (
        <>
            <div className="recipe-banner mt-5 box">
                <img
                    src="/image/banner-bg.png"
                    alt="Delicious recipes"
                    className="recipe-banner-image"
                ></img>
                <div className="recipe-banner-overlay" />
                <div className="recipe-banner-content">
                    <h1>
                        Discover Delicious
                        <br />
                        Recipes Every Day
                    </h1>
                    <p>
                        Explore easy, healthy, and tasty recipes to make
                        <br />
                        your cooking more enjoyable.
                    </p>
                </div>
            </div>
        </>
    )
}