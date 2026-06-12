import KanbanCard from "./KanbanCard";
import { useState } from "react";

export default function KanbanColumn({ column, cards, onDragStart, onDrop, onDragOver, onAddCard, onEdit , canCreate = true }) {
  const [highlight, setHighlight] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setHighlight(true); onDragOver(e, column.id); };
  const handleDragLeave = () => setHighlight(false);
  const handleDrop = (e) => { setHighlight(false); onDrop(e, column.id); };


  return (
    <div
      className="flex flex-col gap-3 min-w-[272px] w-[272px] rounded-lg bg-gray-100 p-2"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ background: column.color }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Colored accent bar */}
          <span className="text-sm font-semibold text-gray-700">{column.name}</span>
          <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">
            {cards.length}
          </span>
        </div>
        {canCreate && (
          <button
          onClick={() => onAddCard(column.id)}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors bg-white"
          title="Ajouter une carte"
          >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        )}
      </div>

      {/* Drop zone */}
      <div
        className={`flex flex-col gap-2 min-h-[120px] rounded-xl p-2 border transition-colors duration-150 ${
          highlight
            ? "bg-blue-50 border-blue-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        {cards.length === 0 && !highlight && (
          <p className="text-xs text-gray-300 text-center mt-8 select-none">Déposer ici</p>
        )}
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onDragStart={onDragStart} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}