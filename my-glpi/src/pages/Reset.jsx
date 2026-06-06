import { useState } from "react";
import { resetAllEntities } from "../services/reset/reset";
import ErrorAlert from "../components/ui/ErrorAlert";

function Reset() {
    const [isResetting, setIsResetting] = useState(false);
    const [steps, setSteps] = useState([]);
    const [completed, setCompleted] = useState(false);

    const handleReset = async () => {
        setIsResetting(true);
        setSteps([]);
        setCompleted(false);

        try {
            await resetAllEntities((progress) => {
                setSteps((prev) => [...prev, progress]);
            });
            setCompleted(true);
        } catch (error) {
            console.error("Reset failed:", error);
            setSteps((prev) => [...prev, { 
                itemtype: "ERROR", 
                message: `Erreur: ${error.message}` 
            }]);
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <section className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Réinitialisation
                    </h1>
                    
                    <button
                        onClick={handleReset}
                        disabled={isResetting}
                        className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg px-8 py-3 mb-8 transition-colors"
                    >
                        {isResetting ? "Réinitialisation en cours..." : "Réinitialiser toutes les entités"}
                    </button>

                    {steps.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Étapes de suppression:
                            </h2>
                            <ul className="space-y-3 max-h-96 overflow-y-auto">
                                {steps.map((step, index) => (
                                    <li key={index} className="p-0">
                                        {step.itemtype === "ERROR" ? (
                                            <ErrorAlert message={step.message} title="Erreur" />
                                        ) : (
                                            <div className="p-4 rounded-lg bg-teal-50 text-teal-900 border border-teal-200">
                                                <div className="font-medium">{step.itemtype}</div>
                                                <div className="text-sm opacity-90">{step.message}</div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {completed && (
                                <div className="mt-6 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
                                    <p className="font-medium">✓ Réinitialisation terminée avec succès</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Reset;