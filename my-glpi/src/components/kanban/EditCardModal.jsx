import { useState } from "react";
import { updateStatus } from "../../models/assistance/Ticket";


export function EditCardModal({ card , onClose  , afterSave}) {

  const [content , setContent] = useState(card.content);

  const handleChange = (e) => {
    setContent(e.target.value);
  }

  const onSave = async (content) => {
    await updateStatus(card.id, card.status.id , content);
    afterSave();
    onClose();
  }


  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl p-5 w-80 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-sm font-semibold text-gray-700">Modifier le statut</h2>
        <p className="text-sm text-gray-500 -mt-2 truncate">{card.content}</p>
        <textarea name="content"  onChange={handleChange} className="w-full border p-2 rounded border-gray-300" required />
        <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
          <button onClick={() => onSave(content)} className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}