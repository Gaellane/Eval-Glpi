```js

const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

useEffect(() => {
    let filtered = tickets || [];

    if (startDate) {
        filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
        // Ajout d'une journée pour inclure la date de fin sélectionnée
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter(t => new Date(t.date) <= end);
    }

    const mapped = filtered.map(t => ({
        id: t.id,
        name: t.name,
        status: statusmapping[t.status.id] || t.status,
        priority: PRIORITY_MAPPING[t.priority] || t.priority,
        date: t.date ? (new Date(t.date)).toLocaleString() : '',
        type : TYPE_MAPPING[t.type] || t.type,
        content : t.content,
    }));

    setDisplayTickets(mapped);
}, [tickets, startDate, endDate, statusmapping]);


<div className="flex gap-4 mb-4">
    <div>
        <label>Date de début : </label>
        <input 
            type="date" 
            onChange={(e) => setStartDate(e.target.value)} 
            className="border p-2"
        />
    </div>
    <div>
        <label>Date de fin : </label>
        <input 
            type="date" 
            onChange={(e) => setEndDate(e.target.value)} 
            className="border p-2"
        />
    </div>
</div>