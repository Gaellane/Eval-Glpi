```js

// Dans vos services (ex: data.js)
export async function getTicketStats(startDate = null, endDate = null) {
    try {
        let tickets = await getAll();

        // Filtrage dynamique
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date('9999-12-31');
            end.setHours(23, 59, 59, 999);

            tickets = tickets.filter(t => {
                const d = new Date(t.date);
                return d >= start && d <= end;
            });
        }

        const grouped = (tickets || []).reduce((acc, ticket) => {
            const key = TYPE_MAPPING[ticket?.type] ?? String(ticket?.type ?? 'Autre');
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const elements = Object.keys(grouped).map(k => ({ title: k, content: `${grouped[k]} tickets` }));
        const total = tickets.length;
        // getTotalCosts devra également être adaptée pour filtrer les tickets passés en argument
        const costs = await getTotalCosts(tickets); 
        
        return { elements, total, costs };
    } catch (error) {
        console.error('Error in getTicketStats:', error);
        return { elements: [], total: 0, costs: {} };
    }
}


function Dashboard() {
    const [dates, setDates] = useState({ start: '', end: '' });
    // ... autres états (ticketStats, ticketCosts, loading)

    const chargerData = async () => {
        setLoading(true);
        try {
            const data = await getTicketStats(dates.start, dates.end);
            setTicketStats(data);
            setTicketCosts(data.costs);
        } catch (error) {
            alert("Erreur : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Relancer le chargement quand les dates changent
    useEffect(() => {
        chargerData();
    }, [dates]);

    return (
        <div>
            {/* UI de filtrage */}
            <div className="flex gap-4 mb-6">
                <input type="date" onChange={(e) => setDates({...dates, start: e.target.value})} />
                <input type="date" onChange={(e) => setDates({...dates, end: e.target.value})} />
                <button onClick={chargerData}>Filtrer</button>
            </div>

            {/* Reste de votre JSX ... */}
        </div>
    );
}