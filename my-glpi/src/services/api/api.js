const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const USERNAME = import.meta.env.VITE_USERNAME;
const PASSWORD = import.meta.env.VITE_PASSWORD;

export async function apiCall(url , method , headers , body = null ,  parameters = {} , debug=false ) {
    try {

        const options = {
            method : method ? method : "GET",
            headers : headers ? headers : {},
            body : body ? JSON.stringify(body) : null
        };
        
        
        const query = new URLSearchParams(parameters).toString();

        const realUrl = url + (query ? "?"+query : "");

        if(debug){
            console.log(" [DEBUG] " , options);
            console.log(" [DEBUG] " , JSON.stringify(options));
            console.log("URL " , realUrl);
        }


        let response = await fetch(realUrl , options);

        if (response.status === 401) {
            if (debug) console.log(" [DEBUG] 401 Détecté, tentative de rafraîchissement du token v2...");
            // Try refresh v2 (OAuth token)
            try {
                await refreshToken();
                const newToken = sessionStorage.getItem("user-token");
                if (newToken) options.headers["Authorization"] = `Bearer ${newToken}`;
                if (debug) console.log(" [DEBUG] Relance de la requête avec le nouveau token v2...");
                response = await fetch(realUrl, options);
            } catch (err) {
                if (debug) console.error(" [DEBUG] refreshToken failed:", err);
            }

            // If still unauthorized, try to refresh v1 session token (used by v1 endpoints)
            if (response.status === 401) {
                if (debug) console.log(" [DEBUG] 401 persistant, tentative de rafraîchissement du token v1...");
                try {
                    await refreshV1Session();
                    const newV1 = sessionStorage.getItem("session-token-v1");
                    if (newV1) options.headers["Session-Token"] = newV1;
                    if (debug) console.log(" [DEBUG] Relance de la requête avec le nouveau token v1...");
                    response = await fetch(realUrl, options);
                } catch (err) {
                    if (debug) console.error(" [DEBUG] refreshV1Session failed:", err);
                }
            }
        }


        if (response.ok) {
            if (response.status === 204) {
                return null;
            }
            return response.json();
        }
        throw new Error(`API call failed with status ${response.title} (${response.status})` , response);
        
    } catch(error) {
        console.error(error);
        throw error;
    }


}

export async function refreshToken() {
    try {

        console.log(" [DEBUG] Tentative de rafraîchissement du token v2...");
        const url = BASE_URL+'/v2.3/token';
        const refreshToken = sessionStorage.getItem("refresh-token");
        
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const body = {
            grant_type: "refresh_token",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshToken,
            scope: "api graphql"
        };

        const headers = {
            "Content-Type": "application/json"
        };
        
        const retour = await apiCall(url , "POST" , headers , body);

        console.log(" [DEBUG] Token refresh response:", retour);

        sessionStorage.setItem("user-token" , retour["access_token"]);
        sessionStorage.setItem("refresh-token" , retour["refresh_token"]);

    } catch(error) {
        throw error;
    }
}

export async function refreshV1Session() {
    try {
        if (!USERNAME || !PASSWORD) {
            throw new Error('V1 credentials not configured');
        }
        const url = BASE_URL + '/v1/initSession';
        const headers = {
            "Authorization": "Basic " + btoa(`${USERNAME}:${PASSWORD}`),
            "Content-Type": "application/json"
        };

        const res = await fetch(url, { method: 'POST', headers });
        if (!res.ok) {
            throw new Error(`V1 initSession failed (${res.status})`);
        }
        const data = await res.json();
        if (data && data.session_token) {
            sessionStorage.setItem("session-token-v1", data.session_token);
            return data;
        }
        throw new Error('No session_token in v1 initSession response');
    } catch (error) {
        console.error(error);
        throw error;
    }
}