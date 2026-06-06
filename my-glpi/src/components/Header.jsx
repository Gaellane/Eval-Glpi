import { refreshToken, refreshV1Session } from "../services/api/api";
import { logoutBO } from "../services/login/login";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorAlert from "./ui/ErrorAlert";


function Header() {
    const [isSubmitting , setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [error , setError] = useState(null);


    const handleLogout = async() => {
        try {
            setIsSubmitting(true);
            logoutBO();
            navigate("/");
        } catch (error) {
            setError("Logout failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleRefreshToken = async() => {
        try {
            setIsSubmitting(true);
            await refreshToken();
            await refreshV1Session();
        } catch (error) {
            setError("Token refresh failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    } 

    return (
        <header className="bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <a className="block text-teal-600" href="#">
                    <span className="sr-only">Home</span>
                </a>

                <div className="flex flex-1 items-center justify-end md:justify-between">
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-6 text-sm">

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Dashboard </a>
                            </li>

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="/accueil/reset"> Reset </a>
                            </li>

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="/accueil/import"> Import </a>
                            </li>

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Tickets </a>
                            </li>

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Projects </a>
                            </li>

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Blog </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            <button disabled={isSubmitting}
                            className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleLogout}>
                                Logout
                            </button>
                        </div>

                        <div className="sm:flex sm:gap-4">
                            <button disabled={isSubmitting}
                             className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleRefreshToken}>
                                Refresh Token
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {error && (
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
                    <ErrorAlert message={error} onClose={() => setError(null)} />
                </div>
            )}
        </header>
    )
}

export default Header;