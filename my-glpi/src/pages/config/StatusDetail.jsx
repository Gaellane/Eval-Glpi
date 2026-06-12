import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    getTraductionsByValue,
    update
} from "../../models/config/TicketStatus";
import { useNavigate } from "react-router-dom";

function StatusDetail() {
    const location = useLocation();
    const [status] = useState(location.state);

    const [name] = useState(status?.name || "");
    const [color, setColor] = useState(status?.color || "#0ea5e9");

    const [langues, setLangues] = useState([]);
    const [existingTraductions, setExistingTraductions] = useState([]);
    const navigate = useNavigate();

    const [newTraduction, setNewTraduction] = useState({
        langue: "",
        traduction: ""
    });

    const [plusTraductions , setPlusTraductions] = useState([]);

    const usedLangueIds = existingTraductions.map(t => t.langue);
    const availableLanguages = langues.filter(l => !usedLangueIds.includes(l.id));

    useEffect(() => {
        const stored = localStorage.getItem("langues");
        if (stored) setLangues(JSON.parse(stored));

        const fetchExisting = async () => {
            if (status?.value) {
                const trad = await getTraductionsByValue(status.value);
                const formatted = trad.map(t => ({
                    langue: t.langue,       
                    traduction: t.traduction 
                }));

                setExistingTraductions(formatted);
            }
        };

        fetchExisting();
    }, [status]);

    const handleAddTraduction = () => {
        if (!newTraduction.langue || !newTraduction.traduction) return;
        const vaovao = {
                langue: parseInt(newTraduction.langue),
                traduction: newTraduction.traduction
            }
        setExistingTraductions(prev => [
            ...prev,
            vaovao
        ]);

        setPlusTraductions(prev => [...prev,vaovao]);
        setNewTraduction({ langue: "", traduction: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await update(status.value , color , plusTraductions);
            navigate("/bo/ticket/status");
        } catch (error) {
            console.log(error);
            alert("Erreur lors de la sauvegarde : " + error.message);
        }
    };

    const handleOnChangeTraduction = (index, field, value) => {
        const updated = [...existingTraductions];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        setExistingTraductions(updated);

        setPlusTraductions(prev => {
            const copy = [...prev];
            const existIndex = copy.findIndex(t => t.langue === updated[index].langue);
            if (existIndex !== -1) {
                copy[existIndex] = updated[index];
            } else {
                copy.push(updated[index]);
            }
            return copy;
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-100 mt-6"
        >
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
                Détails du Statut
            </h2>

            <div className="space-y-6">

                {/* NOM */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-500">
                        Nom par défaut
                    </label>
                    <input
                        value={name}
                        disabled
                        className="p-2.5 bg-gray-50 border rounded-lg text-gray-400 cursor-not-allowed"
                    />
                </div>

                {/* TRADUCTIONS */}
                {existingTraductions.map((trad, index) => (
                    <div key={index} className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            {langues.find(l => l.id === trad.langue)?.name || "Langue inconnue"}
                        </label>

                        <input
                            value={trad.traduction}
                            onChange={(e) => handleOnChangeTraduction(index, "traduction", e.target.value)}
                            className="p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                    </div>
                ))}

                {/* AJOUT */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm font-semibold text-blue-800 mb-3">
                        Ajouter une langue
                    </p>

                    <div className="flex gap-2">
                        <select
                            value={newTraduction.langue}
                            onChange={(e) =>
                                setNewTraduction({
                                    ...newTraduction,
                                    langue: e.target.value
                                })
                            }
                            className="p-2.5 border rounded-lg w-1/3 text-sm"
                        >
                            <option value="">Choisir...</option>
                            {availableLanguages.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>

                        <input
                            placeholder="Traduction..."
                            className="p-2.5 border rounded-lg flex-1 text-sm"
                            value={newTraduction.traduction}
                            onChange={(e) =>
                                setNewTraduction({
                                    ...newTraduction,
                                    traduction: e.target.value
                                })
                            }
                        />

                        <button
                            type="button"
                            onClick={handleAddTraduction}
                            className="bg-blue-600 text-white px-5 rounded-lg text-sm font-bold hover:bg-blue-700"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* COULEUR */}
                <div className="flex items-center gap-4 pt-2">
                    <label className="text-sm font-semibold text-gray-600">
                        Couleur
                    </label>

                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-20 rounded cursor-pointer border-0"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black"
                >
                    Enregistrer les modifications
                </button>
            </div>
        </form>
    );
}

export default StatusDetail;