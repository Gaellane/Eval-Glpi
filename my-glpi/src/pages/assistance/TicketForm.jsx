import { useEffect, useState } from "react";
import { save } from "../../models/assistance/Ticket";
import DataListInput from "../../components/ui/DataListInput";

function TicketForm() {
    const assets = JSON.parse(localStorage.getItem("assets") || "[]");

    const assetsList = Object.values(assets).flat();

    const [ticket, setTicket] = useState({ 
        name: "", 
        content: "", 
        status: "1", 
        type: "1", 
        priority: "3",
        assetName: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const selectedAsset = assetsList.find(a => a.name === ticket.assetName);
            
            const ticketData = {
                ...ticket,
                items: selectedAsset ? [{ itemtype: selectedAsset.item_type, items_id: selectedAsset.id }] : []
            };

            await save(ticketData);
            alert("Ticket créé avec succès !");
            setTicket({ name: "", content: "", status: "1", type: "1", priority: "3", assetName: "" });
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 p-6">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-6 text-gray-900">Nouveau Ticket</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Titre</label>
                        <input name="name" value={ticket.name} onChange={handleChange} className="w-full border p-2 rounded focus:ring-teal-500 border-gray-300" required />
                    </div>

                    <DataListInput 
                        label="Équipement"
                        name="assetName"
                        value={ticket.assetName}
                        onChange={handleChange}
                        options={assetsList.map(a => a.name)}
                        placeholder="Rechercher un asset..."
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="content" value={ticket.content} onChange={handleChange} className="w-full border p-2 rounded border-gray-300" required />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Status</label>
                            <select name="status" value={ticket.status} onChange={handleChange} className="w-full border p-2 rounded border-gray-300">
                                <option value="1">Nouveau</option>
                                <option value="2">En cours</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Type</label>
                            <select name="type" value={ticket.type} onChange={handleChange} className="w-full border p-2 rounded border-gray-300">
                                <option value="1">Incident</option>
                                <option value="2">Demande</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Priorité</label>
                            <select name="priority" value={ticket.priority} onChange={handleChange} className="w-full border p-2 rounded border-gray-300">
                                <option value="1">Très basse</option>
                                <option value="3">Moyenne</option>
                                <option value="5">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        disabled={loading} 
                        type="submit" 
                        className="w-full bg-teal-600 text-white py-2 mt-4 rounded font-medium hover:bg-teal-700 disabled:opacity-50"
                    >
                        {loading ? "Enregistrement..." : "Créer le ticket"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default TicketForm;