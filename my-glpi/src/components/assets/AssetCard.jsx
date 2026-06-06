import React from 'react';

const AssetCard = ({ asset }) => {

  const getStatusColor = (state) => {
    switch (state) {
      case 'En production': return 'bg-green-100 text-green-700';
      case 'En panne': return 'bg-red-100 text-red-700';
      case 'En stock': return 'bg-blue-100 text-blue-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const getText = (v) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (Array.isArray(v)) return v.map(getText).filter(Boolean).join(', ');
    if (typeof v === 'object') {
      // Prefer common display keys and recurse in case they are nested objects
      const keys = ['name', 'label', 'value', 'title'];
      for (const k of keys) {
        if (v[k] !== undefined && v[k] !== null) return getText(v[k]);
      }
      try { return JSON.stringify(v); } catch (e) { return String(v); }
    }
    return String(v);
  };

  return (
    <li className="bg-white border border-slate-200 transition-all duration-300 relative rounded-lg hover:shadow-xl p-6">
      {/* Partie Image ajoutée */}
      <div className="w-full aspect-[16/9] mb-4 overflow-hidden rounded-md bg-slate-100">
        {/* <img 
          src=""
          alt={asset.name} 
          className="w-full h-full object-cover"
        /> */}
      </div>

      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-slate-900">{getText(asset.name)}</h3>
        {(() => {
          const stateText = getText(asset.state);
          const color = getStatusColor(stateText);
          return (
            <span className={`${color} text-xs px-2 py-1 rounded-full font-medium`}>
              {stateText}
            </span>
          );
        })()}
      </div>
      
      <div className="mt-4 space-y-1">
        <p className="text-sm text-slate-600"><strong>Modèle :</strong> {getText(asset.model)} ({getText(asset.manufacturer)})</p>
        <p className="text-sm text-slate-600"><strong>Localisation :</strong> {getText(asset.location)}</p>
        <p className="text-sm text-slate-600"><strong>Utilisateur :</strong> {getText(asset.contact)}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
          {getText(asset.otherserial) || "N/A"}
        </span>
        <span className="text-xs font-semibold text-slate-500 uppercase">{getText(asset.item_type)}</span>
      </div>
    </li>
  );
};

export default AssetCard;