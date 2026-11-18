import AuthImage from '../components/AuthImage';
import '../style/auth.css'
import { Link, useNavigate } from "react-router";
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { loginAsync, googleLoginAsync } from "../store/authSlice";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { user, error } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAsync(email, password));
    };

    const handleGoogleLogin = (credentialResponse) => {
        console.log("GOOGLE RESPONSE:", credentialResponse);

        dispatch(
            googleLoginAsync(
                credentialResponse.credential
            )
        );
    };

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error,
                confirmButtonText: "OK",
            });
        }
    }, [error]);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <>
            <div className="auth-container">

                {/* Left */}
                <AuthImage />

                {/* Right*/}
                <div className="auth-form-wrapper">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h3>Welcome !</h3>
                        <p className="subtitle">Log in into your existing account</p>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="example@mail.com"
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

                        <button className="btn btn-auth w-100 fw-semibold">Log in</button>

                        <div className="d-flex justify-content-center mt-3">
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Google Login Failed",
                                        text: "Unable to login with Google.",
                                    });
                                }}
                            />
                        </div>

                        <div className="bottom-auth">Don't have an account?
                            <Link to="/register"> Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}