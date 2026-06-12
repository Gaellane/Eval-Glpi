export default function KanbanCard({ card, onDragStart, onEdit }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onClick={(e) => { e.preventDefault(); if (onEdit) onEdit(card); }}
      className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-3.5 cursor-grab active:cursor-grabbing active:opacity-60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
    >
      {card.tag && (
        <span
          className="self-start text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: card.tagColor ?? "#e0e7ff", color: card.tagTextColor ?? "#3730a3" }}
        >
          {card.tag}
        </span>
      )}
      <p className="text-sm font-medium text-gray-800 leading-snug">{card.name}</p>
      {card.content && (
        <p className="text-xs text-gray-400 leading-relaxed">{card.content}</p>
      )}
      {card.assignee && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: card.assigneeColor ?? "#6366f1" }}
          >
            {card.assignee[0].toUpperCase()}
          </div>
          <span className="text-xs text-gray-400">{card.assignee}</span>
        </div>
      )}
    </div>
  );
}