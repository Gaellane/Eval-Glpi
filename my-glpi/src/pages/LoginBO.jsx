import { useState } from "react";
import { loginBO , loginGlpi } from "../services/login/login";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ui/ErrorAlert";

function LoginBO() {
    const [inputs, setInputs] = useState({ username: "glpi", password: "glpi" });
    const [error, setError] = useState("");
    const [loading , setLoading] = useState(false);
    const navigate= useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const retour = await loginBO(inputs.username , inputs.password);
            const glpi = await loginGlpi(inputs.username , inputs.password);
            navigate("/bo");   
        } catch (error) {
            setError("Login failed. Please check your credentials.");
            throw error;
        } finally { 
            setLoading(false);
        }
    }

    const handleAccessFO = async() => {
        try {
            setLoading(true);
            await loginGlpi(inputs.username , inputs.password);
            navigate("/fo");
        } catch (error) {
            setError("Login failed. Please check your credentials.");
            throw error;
        } finally {
            setLoading(false);
        }
    }   


    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign in to your account
                        </h1>
                        {error && (
                            <div className="mb-4">
                                <ErrorAlert message={error} onClose={() => setError("")} />
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <input value={inputs.password} onChange={handleChange} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required=""/>
                            </div>
                            <button disabled={loading} type="submit" className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>Sign in</button>
                        </form>
                        <button disabled={loading} onClick={handleAccessFO} className={`w-full text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>Acceder au front-office</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginBO;