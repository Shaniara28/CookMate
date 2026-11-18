import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUserAsync } from "../store/authSlice";

export default function BaseLayout() {

    const dispatch = useDispatch();

    useEffect(() => {

        const token =
            localStorage.getItem("access_token");

        if (token) {
            dispatch(getCurrentUserAsync());
        }

    }, [dispatch]);

    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}