import { getAllAssets } from "../../models/assets/Asset";
import { getAll , TYPE_MAPPING , getTotalCosts } from "../../models/assistance/Ticket";
import { getAllDocs } from "../../models/documents/Document";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { getAllLangues } from "../../models/config/Langue";

export async function chargerDataStorage() {
    const docs = await getAllDocs();
    const assets = await getAllAssets(docs);
    console.log("Assets est : ", assets);
    localStorage.setItem("assets", JSON.stringify(assets));
    localStorage.setItem("documents", JSON.stringify(docs));
    return { assets, documents: docs };
}

export async function chargerLanguesStorage() {
    const langue = await getAllLangues();
    localStorage.setItem("langues", JSON.stringify(langue));
    return langue;
}

export async function setLang(lang=null) {
   localStorage.setItem("lang" , JSON.stringify(lang));
}

export function getAssetsStats() {
    const assets = JSON.parse(localStorage.getItem("assets") || "[]");
    let result = {};
    let number = 0;
    result["elements"] = [];
    for(const k of Object.keys(assets)) {
        const asset = assets[k];
        number+=asset.length;
        result["elements"].push({title : k , content : asset.length+" éléments"});
    }
    result["total"]=number;
    return result;
}

export async  function getTicketStats() {
    try {
        const tickets = await getAll();

        const grouped = (tickets || []).reduce((acc, ticket) => {
            const key = TYPE_MAPPING[ticket?.type] ?? String(ticket?.type ?? 'Autre');
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const elements = Object.keys(grouped).map(k => ({ title: k, content: `${grouped[k]} tickets` }));
        const total = (tickets || []).length;
        const costs = await getTotalCosts(tickets);
        return { elements, total , costs };
    } catch (error) {
        console.error('Error in getTicketStats:', error);
        return { elements: [], total: 0 };
    }
}

// export async function getTicketCostStats() {
//     try {
//         const stats = await getStats();
//         return stats;
//     } catch (error) {
//         console.error('Error in getTicketCostStats:', error);
//         return { totalDuration: 0, totalCostTime: 0, totalCostFixed: 0 };
//     }
// }