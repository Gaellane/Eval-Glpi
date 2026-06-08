import { useEffect } from "react";
import Header from "../components/Header";
import { Outlet, useNavigate } from 'react-router-dom';
import { loginGlpi } from "../services/login/login";
import { chargerDataStorage } from "../services/data/data";


function MainLayoutBO() {

    const navigate = useNavigate();
    const assets = JSON.parse(localStorage.getItem("assets") || null);
    const docs = JSON.parse(localStorage.getItem("documents") || null);

    useEffect(() => {
        const chargerDate = async () => {
            if (!assets) {
                const retour = await chargerDataStorage();
            }
        }
        chargerDate();
    }, [])


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
