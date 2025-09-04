import React from "react";
import Header from "../components/layout/Header"; // adjust path if different
import Footer from "../components/layout/Footer"; // adjust path if different
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 text-[#032E15]">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-lg mb-6">Oops! The page you’re looking for doesn’t exist.</p>
            <Link
                to="/"
                className="px-4 py-2 rounded-lg bg-[#032E15] text-white hover:bg-gray-800 transition"
            >
                Go Back Home
            </Link>
        </main >
    );
};

export default NotFound;
