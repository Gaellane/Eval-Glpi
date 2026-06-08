import { getAll , PRIORITY_MAPPING , TYPE_MAPPING} from "../../models/assistance/Ticket";
import DataTable from "../../components/ui/DataTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function TicketList () {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayTickets, setDisplayTickets] = useState([]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const tickets = await getAll();
            setTickets(tickets);
        } catch (err) {
            console.error(err);
            alert("Erreur lors du chargement des tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        const mapped = (tickets || []).map(t => ({
            id: t.id,
            name: t.name,
            status: typeof t.status === 'object' ? (t.status.name ?? t.status.label ?? JSON.stringify(t.status)) : t.status,
            priority:  PRIORITY_MAPPING[t.priority] || t.priority,
            date: t.date ? (new Date(t.date)).toLocaleString() : '',
            type : TYPE_MAPPING[t.type] || t.type,
            content : t.content,
        }));


        setDisplayTickets(mapped);
    }, [tickets]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleRowClick = (row, index) => {
        // example: log index and navigate to ticket detail by id, pass row via location state
        if (row?.id) {
            navigate(`/bo/ticket/${row.id}`, { state: row });
        } else {
            // fallback: navigate with index and pass row
            navigate(`/bo/ticket/${index}`, { state: row });
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Liste des Tickets</h1>
            <DataTable
                columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'name', label: 'Nom' },
                    { key : 'content' , label : 'Description'},
                    { key: 'status', label: 'Statut' },
                    { key: 'priority', label: 'Priorité' },
                    { key: 'type', label: 'Type' },
                    { key: 'date', label: 'Date de création' },
                ]}
                data={displayTickets}
                onClickRow={handleRowClick}
                loading={loading}
            />
        </div>
    )

}

export default TicketList;