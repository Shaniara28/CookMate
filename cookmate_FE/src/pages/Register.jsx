import AuthImage from '../components/AuthImage';
import '../style/auth.css'
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { registerAsync } from "../store/authSlice";

export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageProfile, setImageProfile] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, registerSuccess } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(
            registerAsync(
                name,
                email,
                password
            )
        );

        if (result.success) {
            Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "Your account has been created successfully.",
                confirmButtonText: "Go to Login",
            }).then(() => {
                navigate("/login");
            });
        }
    };

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: error,
                confirmButtonText: "OK",
            });
        }
    }, [error]);

    return (
        <>
            <div className="auth-container">

                {/* Left */}
                <AuthImage />

                {/* Right*/}
                <div className="auth-form-wrapper">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h3>Let's Get Started !</h3>
                        <p className="subtitle">Create new account to access all features</p>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password min 5 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image Profile</label>
                            <input
                                type="text"
                                className="form-control"
                                id="image"
                                placeholder="Enter image URL"
                                value={imageProfile}
                                onChange={(e) => setImageProfile(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-auth w-100 fw-semibold">Sign Up</button>

                        <div className="bottom-auth">Already have an account?
                            <Link to="/login"> Log In Here</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}