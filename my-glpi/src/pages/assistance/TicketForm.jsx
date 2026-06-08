import { useEffect, useState } from "react";
import { save , PRIORITY_MAPPING } from "../../models/assistance/Ticket";
import DataListInput from "../../components/ui/DataListInput";

function TicketForm() {
    const assets = JSON.parse(localStorage.getItem("assets") || "[]");

    const assetsList = Object.values(assets).flat();

    const priorities = PRIORITY_MAPPING;

    const [ticket, setTicket] = useState({ 
        name: "", 
        content: "", 
        status: "1", 
        type: "1", 
        priority: "3",
        assets: ['']
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAsset = () => {
        setTicket(prev => ({ ...prev, assets: [...(prev.assets || []), ''] }));
    };

    const handleAssetChange = (index, value) => {
        setTicket(prev => {
            const assets = [...(prev.assets || [])];
            assets[index] = value;
            return { ...prev, assets };
        });
    };

    const handleRemoveAsset = (index) => {
        setTicket(prev => {
            const assets = [...(prev.assets || [])];
            assets.splice(index, 1);
            return { ...prev, assets };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const selectedAssets = (ticket.assets || [])
                .map(name => assetsList.find(a => a.name === name))
                .filter(Boolean);

            const ticketData = {
                ...ticket,
                items: selectedAssets.map(a => ({ itemtype: a.item_type, items_id: a.id }))
            };

            await save(ticketData);
            alert("Ticket créé avec succès !");
            setTicket({ name: "", content: "", status: "1", type: "1", priority: "3", assets: [''] });
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création du ticket");
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Équipements</label>
                        <div className="space-y-2 mt-1">
                            {(ticket.assets || []).map((assetName, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <DataListInput
                                        label={""}
                                        name={`asset-${idx}`}
                                        value={assetName}
                                        onChange={e => handleAssetChange(idx, e.target.value)}
                                        options={assetsList.map(a => a.name)}
                                        placeholder="Rechercher un asset..."
                                    />
                                    <button type="button" onClick={() => handleRemoveAsset(idx)} className="text-sm text-red-600">Supprimer</button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddAsset} className="text-sm text-teal-600">Ajouter équipement</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="content" value={ticket.content} onChange={handleChange} className="w-full border p-2 rounded border-gray-300" required />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
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
                                                {Object.entries(priorities).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
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