import { useLocation } from "react-router-dom";
import { getItemsByTicket, updateStatus , STATUS_MAPPING } from "../../models/assistance/Ticket";
import { useEffect, useState } from "react";
import { getAllByTicket } from "../../models/assistance/TicketCost";

const ITEM_ICONS = {
  Computer: "💻", Monitor: "🖥️", NetworkEquipment: "🌐",
  Printer: "🖨️", Phone: "📱", Peripheral: "🔌", Software: "📦",
};

export default function TicketDetail() {
  const location = useLocation();
  const props = location?.state ?? null;
  const assets = JSON.parse(localStorage.getItem("assets") || "{}");

  const [ticket, setTicket] = useState(props);
  const [statusValue, setStatusValue] = useState();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadDetails = async () => {
    if (!ticket || !ticket.id) return;
    try {
      const items = await getItemsByTicket(ticket.id);
      const costs = await getAllByTicket(ticket.id);
      setTicket(prev => ({ ...prev, costs: costs, items: items }));
    } catch (err) {
      console.error('Failed loading ticket details', err);
    }
  }

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]);


  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusValue) {
      alert("Veuillez sélectionner un statut.");
      return;
    }
    setUpdatingStatus(true);
    try {
      const updatedTicket = await updateStatus(ticket.id, statusValue);
      setTicket({ ...ticket, status: STATUS_MAPPING[statusValue] ?? statusValue });
      alert("Statut mis à jour avec succès !");
    } catch (err) {
      console.error('Failed updating status', err);
      alert("Erreur lors de la mise à jour du statut.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  const handleOnChangeStatus = (e) => {
    e.preventDefault();
    setStatusValue(e.target.value);
  }


  if (!ticket) {
    return (
      <section className="bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold">Aucun ticket sélectionné</h2>
          <p className="text-sm text-gray-500 mt-2">Sélectionnez un ticket depuis la liste pour voir ses détails.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.name ?? 'Sans titre'}</h1>
            {ticket.ref && <p className="text-sm text-gray-500 mt-1">Réf : {ticket.ref}</p>}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700">{ticket.status ?? '—'}</span>
              <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-yellow-50 text-yellow-700">{ticket.priority ?? '—'}</span>
              <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-teal-50 text-teal-700">{ticket.type ?? '—'}</span>
            </div>
            {ticket.date && <div className="text-sm text-gray-500">{ticket.date}</div>}
          </div>
        </header>

        <div className="mt-6 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <div className="prose max-w-none text-gray-700">{ticket.content ?? 'Aucune description.'}</div>
          </section>

          <section className="bg-gray-50 p-4 rounded border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Informations</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
              <div>
                <dt className="font-medium text-gray-800">Type</dt>
                <dd>{ticket.type ?? '—'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-800">Priorité</dt>
                <dd>{ticket.priority ?? '—'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-800">Statut</dt>
                <dd>{ticket.status ?? '—'}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-800">Date</dt>
                <dd>{ticket.date ?? ''}</dd>
              </div>
            </dl>
          </section>

          {ticket.items && ticket.items.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Assets liés ({ticket.items.length})</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticket.items.map((item, i) => {
                  const icon = ITEM_ICONS[item.itemtype] ?? '📦';
                  const asset = assets?.[item.itemtype]?.find(a => String(a.id) === String(item.items_id));
                  const asset_name = asset?.name ?? asset?.otherserial ?? asset?.id ?? '—';

                  return (
                    <li key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded hover:shadow-sm">
                      <div className="text-2xl">{icon}</div>
                      <div>
                        <div className="font-medium text-gray-800">{asset_name}</div>
                        <div className="text-sm text-gray-500">{item.itemtype}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {ticket.costs && ticket.costs.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Coûts liés ({ticket.costs.length})</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticket.costs.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded hover:shadow-sm">
                    <div>
                      <div className="text-sm text-gray-500">Duree : {item.duration}</div>
                      <div className="text-sm text-gray-500">Cout a l'heure : {item.cost_time}</div>
                      <div className="text-sm text-gray-500">Cout fixe : {item.cost_fixed}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-white p-4 rounded border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Mettre à jour le statut</h3>
            <form className="flex items-center gap-2" onSubmit={handleStatusUpdate}>
              <select value={statusValue} onChange={handleOnChangeStatus} className="border p-2 rounded border-gray-300 text-sm">
                {STATUS_MAPPING && Object.entries(STATUS_MAPPING).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <button type="submit" disabled={updatingStatus} className="bg-teal-600 text-white py-2 px-3 rounded disabled:opacity-50 text-sm">
                {updatingStatus ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}
