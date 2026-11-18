import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Banner from "../components/Banner";
import "../style/addRecipe.css";
import { updateProfileAsync } from "../store/authSlice";

export default function UpdateProfile() {

    const { user, loading } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [imageProfile, setImageProfile] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setImageProfile(user.imageProfile || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(
            updateProfileAsync(
                name,
                imageProfile
            )
        );

        if (result.success) {
            await Swal.fire({
                icon: "success",
                title: "Profile Updated!",
                text: "Your profile has been updated successfully.",
                confirmButtonText: "OK",
            });

            navigate("/profile");

        } else {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: result.message,
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <>
            <Banner />

            <div className="container my-5">
                <div className="title text-center">
                    <h1>Update Profile</h1>
                    <p>Update your profile information</p>
                </div>

                <form className="w-50 m-auto" onSubmit={handleSubmit}>

                    {/* Preview */}
                    <div className="text-center mb-4">
                        <img
                            src={imageProfile || "/image/profile-default.jpg"}
                            alt="Profile"
                            className="rounded-circle"
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                            }}
                            onError={(e) => { e.currentTarget.src = "/image/profile-default.jpg"; }}
                        />
                    </div>

                    {/* Name */}
                    <div className="mb-3">

                        <label htmlFor="name" className="form-label">
                            Name
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

                    {/* Image Profile */}
                    <div className="mb-3">

                        <label htmlFor="imageProfile" className="form-label">
                            Image Profile
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            id="imageProfile"
                            placeholder="Enter your image URL"
                            value={imageProfile}
                            onChange={(e) => setImageProfile(e.target.value)}
                        />

                    </div>

                    <button type="submit" className="btn w-100 btn-yellow"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                />
                                Updating...
                            </>
                        ) : (
                            "Update Profile"
                        )}
                    </button>
                </form>
            </div>
        </>
    );
}