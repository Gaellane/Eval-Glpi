import React, { useState, useEffect, useMemo } from 'react';
import AssetCard from './AssetCard';

const AssetList = () => {
    const [assets, setAssets] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [selectedStates, setSelectedStates] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState([]);
    const [textQuery, setTextQuery] = useState('');

    useEffect(() => {   
        const fetchAssets = () => {
            try {
                setLoading(true);
                const storedAssets = localStorage.getItem("assets");
                if (storedAssets) {
                    setAssets(JSON.parse(storedAssets) || {});
                } else {
                    setError("Aucun actif trouvé dans le stockage local.");
                }
            } catch (err) {
                setError("Erreur lors du chargement des actifs: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, []);

   
    // Helper to safely read text from possibly-object fields
    const getText = (v) => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
        if (Array.isArray(v)) return v.map(getText).filter(Boolean).join(', ');
        if (typeof v === 'object') {
            return v.name || v.label || v.value || v.title || JSON.stringify(v);
        }
        return String(v);
    };

    const allItems = useMemo(() => {
        if (!assets || typeof assets !== 'object') return [];
        return Object.values(assets).flat().filter(Boolean);
    }, [assets]);

    const uniqueStates = useMemo(() => {
        const s = new Set();
        allItems.forEach(a => {
            const val = getText(a.state).trim();
            if (val) s.add(val);
        });
        return [...s].sort();
    }, [allItems]);

    const uniqueTypes = useMemo(() => {
        if (!assets || typeof assets !== 'object') return [];
        return Object.keys(assets).filter(Boolean).sort();
    }, [assets]);

    const uniqueManufacturers = useMemo(() => {
        const s = new Set();
        allItems.forEach(a => {
            const val = getText(a.manufacturer).trim();
            if (val) s.add(val);
        });
        return [...s].sort();
    }, [allItems]);

    const toggleArrayValue = (arr, setter, rawValue) => {
        const value = rawValue.trim().toLowerCase();
        setter(prev => {
            const normalized = prev.map(p => p.toLowerCase());
            if (normalized.includes(value)) {
                return prev.filter(p => p.toLowerCase() !== value);
            }
            return [...prev, rawValue];
        });
    };

    const resetFilters = () => {
        setSelectedStates([]);
        setSelectedTypes([]);
        setSelectedManufacturers([]);
        setTextQuery('');
    };

   
    
    const filteredAssets = useMemo(() => {
        if (!assets || typeof assets !== 'object') return {};
        const q = textQuery.trim().toLowerCase();

        const stateSet = selectedStates.map(s => s.trim().toLowerCase());
        const typeSet = selectedTypes.map(s => s.trim().toLowerCase());
        const manuSet = selectedManufacturers.map(s => s.trim().toLowerCase());

        const result = {};
        Object.entries(assets).forEach(([category, items]) => {
            if (!Array.isArray(items)) return;
            const filtered = items.filter(asset => {
                const state = getText(asset.state).toLowerCase();
                const typeVal = (getText(asset.item_type) || category).toLowerCase();
                const manuf = getText(asset.manufacturer).toLowerCase();

                if (stateSet.length > 0 && !stateSet.includes(state)) return false;
                if (typeSet.length > 0 && !typeSet.includes(typeVal)) return false;
                if (manuSet.length > 0 && !manuSet.includes(manuf)) return false;

                if (q) {
                    const name = getText(asset.name).toLowerCase();
                    const contact = getText(asset.contact).toLowerCase();
                    const model = getText(asset.model).toLowerCase();
                    if (!(name.includes(q) || contact.includes(q) || model.includes(q))) {
                        return false;
                    }
                }

                return true;
            });

            if (filtered.length > 0) result[category] = filtered;
        });

        return result;
    }, [assets, selectedStates, selectedTypes, selectedManufacturers, textQuery]);

    const totalCount = useMemo(() => Object.values(filteredAssets).flat().length, [filteredAssets]);

    if (loading) return <div className="text-center py-20 text-slate-600">Chargement de l'inventaire...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    return (
        <section className="mt-6 px-4 md:px-8 py-10" aria-labelledby="inventory-heading">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <h2 id="inventory-heading" className="text-3xl font-bold text-slate-900">Inventaire Global</h2>
                    <p className="text-base text-slate-600 mt-2">Gestion complète des actifs du parc.</p>
                </div>

                {/* Filter panel */}
                <div className="mb-6 p-4 bg-white border rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Recherche (nom, utilisateur, modèle)</label>
                            <input
                                type="text"
                                value={textQuery}
                                onChange={(e) => setTextQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={resetFilters} className="px-3 py-2 bg-slate-100 border rounded">Réinitialiser</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm font-semibold mb-2">États</div>
                            <div className="flex flex-wrap gap-2">
                                {uniqueStates.map(s => (
                                    <label key={s} className="inline-flex items-center text-sm mr-2">
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                            checked={selectedStates.map(x=>x.toLowerCase()).includes(s.toLowerCase())}
                                            onChange={() => toggleArrayValue(selectedStates, setSelectedStates, s)}
                                        />
                                        <span>{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold mb-2">Types</div>
                            <div className="flex flex-wrap gap-2">
                                {uniqueTypes.map(t => (
                                    <label key={t} className="inline-flex items-center text-sm mr-2">
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                            checked={selectedTypes.map(x=>x.toLowerCase()).includes(t.toLowerCase())}
                                            onChange={() => toggleArrayValue(selectedTypes, setSelectedTypes, t)}
                                        />
                                        <span>{t}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-semibold mb-2">Fabricants</div>
                            <div className="flex flex-wrap gap-2">
                                {uniqueManufacturers.map(m => (
                                    <label key={m} className="inline-flex items-center text-sm mr-2">
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                            checked={selectedManufacturers.map(x=>x.toLowerCase()).includes(m.toLowerCase())}
                                            onChange={() => toggleArrayValue(selectedManufacturers, setSelectedManufacturers, m)}
                                        />
                                        <span>{m}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-slate-800 mb-0">Résultats ({totalCount})</h3>
                </div>

                {Object.entries(filteredAssets).map(([category, items]) => (
                    items && items.length > 0 && (
                        <div key={category} className="mb-12">
                            <h3 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-2">
                                {category} ({items.length})
                            </h3>
                            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((asset) => (
                                    <AssetCard key={`${getText(asset.item_type || category)}-${asset.id || JSON.stringify(asset)}`} asset={asset} />
                                ))}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </section>
    );
};

export default AssetList;