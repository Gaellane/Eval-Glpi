import { getAll , PRIORITY_MAPPING , STATUS_MAPPING, TYPE_MAPPING } from "../../models/assistance/Ticket";
import DataTable from "../../components/ui/DataTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTraductionsByLangue } from '../../models/config/TicketStatus'


function TicketList () {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayTickets, setDisplayTickets] = useState([]);
    const [statusmapping , setStatusMapping] = useState(STATUS_MAPPING);
    const langue = localStorage.getItem("lang") ?  JSON.parse(localStorage.getItem("lang")) : {
                                                                                                    "name": "Anglais",
                                                                                                    "code": "ang",
                                                                                                    "id": 2
                                                                                                };
    const fetchStatus = async () => {
        setLoading(true);
        try {
            console.log("langue :" ,langue );
            const status = await getAllTraductionsByLangue(langue.id);

            setStatusMapping({...statusmapping , ...status});
        } catch (err) {
            console.error(err);
            alert("Erreur lors du chargement ma status");
        } finally {
            setLoading(false);
        }
    }

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
            status: statusmapping[t.status.id] || t.status,
            priority:  PRIORITY_MAPPING[t.priority] || t.priority,
            date: t.date ? (new Date(t.date)).toLocaleString() : '',
            type : TYPE_MAPPING[t.type] || t.type,
            content : t.content,
        }));


        setDisplayTickets(mapped);
    }, [tickets]);

    useEffect(() => {
        fetchTickets();
        fetchStatus();
    }, []);

    const handleRowClick = (row, index) => {
        if (row?.id) {
            navigate(`/bo/ticket/${row.id}`, { state: row });
        } else {
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