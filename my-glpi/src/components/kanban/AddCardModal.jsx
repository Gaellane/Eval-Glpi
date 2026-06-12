import { useState } from "react";
import { PRIORITY_MAPPING, TYPE_MAPPING } from "../../models/assistance/Ticket";
import TicketForm from "../../pages/assistance/TicketForm";

export function AddCardModal({ onClose }) {

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

        <TicketForm />
      </div>
    </div>


  );
}