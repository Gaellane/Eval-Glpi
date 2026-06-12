import { useState } from "react";
import TicketDetail from "../assistance/TicketDetail";
import { STATUS_MAPPING , PRIORITY_MAPPING , TYPE_MAPPING} from "../../models/assistance/Ticket";

export function InformationCardModal({ card, onClose }) {
    const ticket = {
      id : card?.id,
      name : card?.name,
        status : STATUS_MAPPING[card?.status.id] || card?.status.name,
        priority : PRIORITY_MAPPING[card?.priority] || card?.priority,
        date : card?.date,
        type : TYPE_MAPPING[card?.type] || card?.type,
        content : card?.content,
    }
    return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <TicketDetail card={ticket} />
      </div>
    </div>


  );
}