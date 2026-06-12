import KanbanColumn from "../../components/kanban/KanbanColumn";
import { useState, useRef, useEffect, use } from "react";
import { AddCardModal } from "../../components/kanban/AddCardModal";
import { EditCardModal } from "../../components/kanban/EditCardModal";
import { getAll, STATUS_MAPPING, updateStatus } from "../../models/assistance/Ticket";
import { InformationCardModal } from "./InformationCardModal";
import { getAllTicketStatus, getAllTraductionsByLangue } from "../../models/config/TicketStatus";
import { CostCardModal }  from "../../components/kanban/CostCardModal";

let nextId = 100;

export default function KanbanBoard() {
  const [columns, setColumns] = useState([]);
  const [addingColumnId, setAddingColumnId] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const dragCardId = useRef(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationcard, setConfirmationCard] = useState(null);
  const [costcard , setCostCard] = useState(null);
  const langue = localStorage.getItem("lang") ? JSON.parse(localStorage.getItem("lang")) : {
    "name": "Anglais",
    "code": "ang",
    "id": 2
  };

  const fetchStatus = async () => {
  setLoading(true);
  try {
    const status = await getAllTraductionsByLangue(langue.id);
    const statusList = await getAllTicketStatus();

    let cols = STATUS_MAPPING;
    if (status) {
      cols = { ...cols, ...status };
    }

    console.log("cols : " , cols);

    const formatted = Object.entries(cols).map(([key, label]) => ({
      id: Number(key),
      value: Number(key), 
      name: label,
      color: statusList.find(s => s.value === Number(key))?.color || "#FFFFFF"
    }));

    
    setColumns(formatted);

  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des status");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchStatus();
  }, []);


  const fetchTickets = async () => {
    try {
      const response = await getAll();
      setTickets(response);
    } catch (error) {
      alert("Erreur lors de la récupération des tickets : " + error.message);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDragStart = (e, cardId) => {
    dragCardId.current = cardId;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    console.log("Dropped card", dragCardId.current, "on column", targetColumnId);
    if (!dragCardId.current) return;

    const ticket = tickets.find(t => t.id === dragCardId.current);

    if (ticket?.status?.id === 6 ) {
      setConfirmationCard({ ...ticket, status: { id: targetColumnId } });
      dragCardId.current = null;
      return;
    }

    if(targetColumnId==6) {
      setCostCard({ ...ticket, status: { id: targetColumnId } });
      dragCardId.current = null;
      return;
    }

    try {
      await updateStatus(dragCardId.current, targetColumnId);

      setTickets((prev) =>
        prev.map((c) =>
          c.id === dragCardId.current
            ? { ...c, status: { ...c.status, id: targetColumnId } }
            : c
        )
      );

      dragCardId.current = null;
    } catch (error) {
      alert("Erreur lors de la mise à jour du ticket : " + error.message);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleAddCard = (columnId) => {
    setAddingColumnId(columnId);
  };

  const handleConfirmAddCard = (title) => {
    if (!title?.trim()) return;
    setCards((prev) => [
      ...prev,
      { id: String(++nextId), columnId: addingColumnId, title: title.trim() },
    ]);
    setAddingColumnId(null);
  };


  const handleShowCard = (card) => {
    setEditingCard(card);
  };

  const handleSaveEdit = () => {
    const status = dragCardId.current;
    if (!confirmationcard) return;
    setTickets((prev) => prev.map((c) => (c.id === confirmationcard.id ? { ...c, status } : c)));
    setConfirmationCard(null);
  };

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-6 pt-4 px-4 items-start">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={tickets.filter((t) => t.status.id === col.value)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onAddCard={handleAddCard}
            onEdit={handleShowCard}
            canCreate={col.value === 1}
          />
        ))}
      </div>

      {addingColumnId && (
        <AddCardModal
          onAdd={handleConfirmAddCard}
          onClose={() => setAddingColumnId(null)}
        />
      )}

      {editingCard && (
        <InformationCardModal
          card={editingCard}
          onClose={() => setEditingCard(null)}
        />
      )}

      {confirmationcard && (
        <EditCardModal
          card={confirmationcard}
          onClose={() => setConfirmationCard(null)}
          afterSave={fetchTickets}
        />
      )}

      {costcard && (
        <CostCardModal
          card={costcard}
          onClose={() => setCostCard(null)}
          afterSave={fetchTickets}
        />
      )}
    </>
  );
}