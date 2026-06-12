import DataTable from "../../components/ui/DataTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTicketStatus } from "../../models/config/TicketStatus";


function StatusList() {
    const navigate = useNavigate();
    const [status, setstatus] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const status = await getAllTicketStatus();
            setstatus(status);
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

    const handleRowClick = (row, index) => {
        // example: log index and navigate to status detail by id, pass row via location state
        if (row?.id) {
            navigate(`/bo/ticket/status/${row.id}`, { state: row });
        } else {
            // fallback: navigate with index and pass row
            navigate(`/bo/ticket/status/${index}`, { state: row });
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Liste des Status</h1>
            <DataTable
                columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'name', label: 'Nom' },
                    { key : 'color', label : 'Couleur' },
                ]}
                data={status}
                loading={loading}
                onClickRow={handleRowClick}
            />
        </div>
    );
}

export default StatusList;