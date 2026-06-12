import { refreshToken, refreshV1Session } from "../services/api/api";
import { logoutBO } from "../services/login/login";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorAlert from "./ui/ErrorAlert";
import { setLang } from "../services/data/data";


function Header() {
    const [isSubmitting , setIsSubmitting] = useState(false);
    const [selectLang , setSelectLang] = useState(localStorage.getItem("lang") ?  JSON.parse(localStorage.getItem("lang")) : {
                                                                                                    "name": "Anglais",
                                                                                                    "code": "ang",
                                                                                                    "id": 2
                                                                                                });
    const navigate = useNavigate();
    const [error , setError] = useState(null);
    const isBO = sessionStorage.getItem("bo-token") !== null;
    const langues = localStorage.getItem("langues") ? JSON.parse(localStorage.getItem("langues")) : null;


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

    const handleOnChange = (e) => {
        const selectedLang = langues.find(l => l.id === Number(e.target.value));
        setSelectLang(selectedLang);
        setLang(selectedLang);
        window.location.reload();
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
                            {isBO && (
                                <>
                                    <li>
                                        <a className="text-gray-500 transition hover:text-gray-500/75" href="/bo"> Dashboard </a>
                                    </li>

                                    <li>
                                        <a className="text-gray-500 transition hover:text-gray-500/75" href="/bo/reset"> Reset </a>
                                    </li>

                                    <li>
                                        <a className="text-gray-500 transition hover:text-gray-500/75" href="/bo/import"> Import </a>
                                    </li>

                                    <li>
                                        <a className="text-gray-500 transition hover:text-gray-500/75" href="/bo/ticket"> Tickets </a>
                                    </li>

                                    <li>
                                        <a className="text-gray-500 transition hover:text-gray-500/75" href="/bo/ticket/status"> Status </a>
                                    </li>
                                </>
                            )}

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="/fo/assets"> Assets </a>
                            </li>
                            

                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="/fo/ticket/add"> Add Ticket  </a>
                            </li>


                            <li>
                                <a className="text-gray-500 transition hover:text-gray-500/75" href="/fo/kanban"> Kanban   </a>
                            </li>
                        </ul>
                    </nav>

                    {isBO && (

                        <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4">
                            <button disabled={isSubmitting}
                            className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                        
                    )}
                    {!isBO && (
                            <div className="sm:flex sm:gap-4">
                            <a href="/"
                             className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}

                            >
                                Login as backoffice
                            </a>
                        </div>
                        
                        )}
                    <div className="sm:flex sm:gap-4">
                            <button disabled={isSubmitting}
                             className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleRefreshToken}>
                                Refresh Token
                            </button>
                    </div>
                    <select name="langue" id="langue" onChange={handleOnChange}>
                        {langues && langues.map(langue => (
                            <option key={langue.id} value={langue.id} selected={selectLang && selectLang.id==langue.id}>{langue.name}</option>
                        ))}
                    </select>
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