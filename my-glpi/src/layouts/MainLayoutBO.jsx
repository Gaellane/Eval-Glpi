import { useEffect } from "react";
import Header from "../components/Header";
import { Outlet, useNavigate } from 'react-router-dom';
import { loginGlpi } from "../services/login/login";


function MainLayoutBO() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("bo-token");
        if (!token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const getToken = async () => {
            const glpi_token = sessionStorage.getItem("user-token");
            if (!glpi_token) {
                await loginGlpi();
            }
        }
        getToken();
    }, []);


    return (
        <div class="min-h-screen bg-gray-50">
            <Header />
            <main class="container mx-auto p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayoutBO;
