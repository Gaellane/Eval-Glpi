import React, { useState, useEffect } from 'react';
import { getAssetsStats, getTicketStats  } from '../services/data/data';
import CardWithHeader from '../components/ui/CartWithHeader';
import Spinner from '../components/ui/Spinner';
import { getAllCostsByAssets } from '../models/assistance/Ticket';

function Dashboard() {
    const [assetsStats, setAssetsStats] = useState({ elements: [], total: 0 });
    const [ticketStats, setTicketStats] = useState({ elements: [], total: 0 });
    const [ticketCosts, setTicketCosts] = useState({ totalDuration: 0, totalCostTime: 0, totalCostFixed: 0, totalCostTimeWC: 0 });
    const [statsCosts , setStatsCosts] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const chargerData = async () => {
            try {
                setLoading(true);
                setAssetsStats(getAssetsStats());
                const data = await getTicketStats();
                setTicketStats(data);
                setTicketCosts(data.costs);
                const retourCosts = await getAllCostsByAssets();
                setStatsCosts(retourCosts);
                console.log("ETO EHHHH",Object.entries(retourCosts))
            } catch (error) {
                alert("Erreur lors du chargement des statistiques : " + error.message);
            } finally {
                setLoading(false);
            }
        };
        chargerData();
    }, []);

    if (loading) {
        return (
            <>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-lg text-slate-700">Chargement des statistiques...</p>
                <Spinner />
            </>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <h2 className="text-3xl text-slate-900">Nombre des elements </h2>
            <p className="text-lg text-slate-700">Total: {assetsStats.total}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assetsStats.elements.map((stat, index) => (
                    // Use stat.id if it exists, otherwise use index
                    <CardWithHeader key={stat.id || index} props={stat} />
                ))}
            </div>
            <br />
            <h2 className="text-3xl text-slate-900">Nombre des tickets </h2>
            <p className="text-lg text-slate-700">Total: {ticketStats.total}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ticketStats.elements.map((stat, index) => (
                    // Use stat.id if it exists, otherwise use index
                    <CardWithHeader key={stat.id || index} props={stat} />
                ))}
            </div>
            <br />
            <h2 className="text-3xl text-slate-900">Coûts des tickets </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardWithHeader props={{ title: "Durée totale", content: ticketCosts.totalDuration }} />
                <CardWithHeader props={{ title: "Coût temps total", content: ticketCosts.totalCostTime }} />
                <CardWithHeader props={{ title: "Coût fixe total", content: ticketCosts.totalCostFixed }} />
                <CardWithHeader props={{ title: "Coût temps sans prise en compte du temps", content: ticketCosts.totalCostTimeWC }} />
            </div>

            <table>
                {/* <thead> */}
                    <tr>
                        <th>Item</th>
                        <th>TotalGlpi</th>
                        <th>Total SQLITE</th>
                        <th>Ouverture</th>
                        <th>Total</th>
                    </tr>
                {/* </thead> */}
                {/* <tbody> */}
                    {statsCosts && Object.entries(statsCosts).map( s =>(
                        <tr>
                            <td>{ s[0] }</td>
                            <td>{ s[1].totalCostGlpi }</td>
                            <td>{ s[1].super_cost }</td>
                            <td>{ s[1].ouverture }</td>
                            <td>{ s[1].totalCost }</td>
                        </tr>
                    ))}
                {/* </tbody> */}
            </table>
        </div>
    );
}

export default Dashboard;