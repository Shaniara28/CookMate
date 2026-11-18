import { NavLink } from "react-router";
import '../style/navbar.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../store/authSlice";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

export default function Navbar() {

    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, logout",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(logout());
                navigate("/login");
            }
        });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top bg-body-tertiary box">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">
                        <img src="/image/barbecue-yellow.png" alt="" className="img-fluid img-nav" />
                        <span className="ms-2">CookMate</span>
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? "nav-link-active fw-semibold" : ""}`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/explore-recipes"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? "nav-link-active fw-semibold" : ""}`
                                    }
                                >
                                    Explore
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/ai-recommendation"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive
                                            ? "nav-link-active fw-semibold"
                                            : ""
                                        }`
                                    }
                                >
                                    AI Recomendation
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/add-recipe"
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? "nav-link-active fw-semibold" : ""}`
                                    }
                                >
                                    Add Recipe
                                </NavLink>
                            </li>
                        </ul>
                        <div className="d-flex align-items-center gap-5">
                            <NavLink to="/profile"
                                className={({ isActive }) =>
                                    `nav-link d-flex gap-2 align-items-center ${isActive ? "nav-link-active fw-semibold" : ""}`
                                }>
                                <img
                                    src={user?.imageProfile || "/image/profile-default.jpg"}
                                    alt="Profile"
                                    className="img-fluid img-nav rounded-circle"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/image/profile-default.jpg";
                                    }}
                                />
                                <span htmlFor="name" className="nav-pointer">
                                    {user?.name}
                                </span>
                            </NavLink>
                            <button className="btn btn-yellow fs-semibold px-3" type="submit" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}