import { useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from 'react-router-dom';
import { loginGlpi } from "../services/login/login";
import { chargerDataStorage } from "../services/data/data";

function MainLayoutFO() {
    const assets = JSON.parse(localStorage.getItem("assets") || null);
    const docs = JSON.parse(localStorage.getItem("documents") || null);
    const langues = JSON.parse(localStorage.getItem("langues") || null);    


    useEffect(() => {
        const chargerDate = async () => {
          if (!assets || !docs) {
              const retour = await chargerDataStorage();
          }
          if(!langues) {
                const languesData = await chargerLanguesStorage();
            }   
        }
        chargerDate();
    }, [])


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

export default MainLayoutFO;
