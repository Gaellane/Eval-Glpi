import { useState } from "react";
import { parseFile } from "../services/import/import.js";
import { importFile } from "../services/import/import.js";

function Import() {
    const [filesData, setFilesData] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [skipImages, setSkipImages] = useState(false);

    const handleChange = async (event) => {
        const { id, files } = event.target;
        setError(null);
        if (!files?.length) return;

        try {
            const parsed = await parseFile(files[0], id);
            if (parsed) {
                setFilesData((prev) => ({ ...prev, [id]: parsed }));
            }
        } catch (err) {
            console.error(err);
            setError("Impossible de parser le fichier.");
        }
    };

    const handleZipChange = (event) => {
        const { files } = event.target;
        if (!files?.length) return;
        setFilesData((prev) => ({ ...prev, zip: files[0] }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(" [DEBUG] FilesData " , filesData);
            setIsLoading(true);
            const imagesArg = !skipImages;
            await importFile(filesData, imagesArg);
        } catch (err) {
            console.error(err);
            setError("Une erreur est survenue lors de l'import.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full text-slate-600 font-medium text-sm border border-slate-200 rounded-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 file:cursor-pointer file:border-0 file:py-2.5 file:px-3 file:mr-4 file:bg-gray-100 hover:file:bg-gray-200 file:text-slate-500";

    return (
        <div className="space-y-8 max-w-md mx-auto mt-6">
            
            <div className="max-w-sm">
                <label htmlFor="file1" className="text-slate-900 text-sm font-medium mb-2 block">
                    Upload file
                </label>
                <input id="file1" type="file" onChange={handleChange} className={inputClass} />
            </div>

            <div className="max-w-sm">
                <label htmlFor="file2" className="text-slate-900 text-sm font-medium mb-2 block">
                    Upload file
                </label>
                <input id="file2" type="file" onChange={handleChange} className={inputClass} />
            </div>

            <div className="max-w-sm">
                <label htmlFor="file3" className="text-slate-900 text-sm font-medium mb-2 block">
                    Upload file
                </label>
                <input id="file3" type="file" onChange={handleChange} className={inputClass} />
            </div>

            <div className="max-w-sm">
                <label htmlFor="zip" className="text-slate-900 text-sm font-medium mb-2 block">
                    Images des assets (ZIP)
                </label>
                <input
                    id="zip"
                    type="file"
                    accept=".zip"
                    onChange={handleZipChange}
                    className={inputClass}
                />
                {filesData.zip && (
                    <p className="text-xs text-slate-500 mt-1">
                         {filesData.zip.name}
                    </p>
                )}
                <div className="mt-3">
                    <label className="inline-flex items-center text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={skipImages}
                            onChange={(e) => setSkipImages(e.target.checked)}
                            className="form-checkbox h-4 w-4 text-teal-600"
                        />
                        <span className="ml-2">Ne pas importer les images</span>
                    </label>
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                disabled={isLoading}
                onClick={handleSubmit}
                className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Envoyer
            </button>
        </div>
    );
}

export default Import;