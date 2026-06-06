import { apiCall } from "../api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const USERNAME = import.meta.env.VITE_USERNAME;
const PASSWORD = import.meta.env.VITE_PASSWORD;


export async function loginGlpi(username = USERNAME , passsword = PASSWORD) {
    try {
        const url = BASE_URL+'/v2.3/token';
        const urlv1 = BASE_URL+'/v1/initSession';  // à utiliser si on veut rester en v1 (sans token)

        const body = {
            grant_type: "password",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            username: username,
            password: passsword,
            scope: "api graphql"
        };

        const headersV2 = {
            "Content-Type": "application/json"
        };
        
        const loginV2 = await apiCall(url , "POST" , headersV2 , body);

        const headersV1 = {
            "Authorization": "Basic " + btoa(`${username}:${passsword}`),
        };
        const loginV1 = await apiCall(urlv1 , "POST" , headersV1);

        sessionStorage.setItem("user-token" , loginV2["access_token"]);
        sessionStorage.setItem("refresh-token" , loginV2["refresh_token"]);
        sessionStorage.setItem("session-token-v1" , loginV1["session_token"]); // stocke le token de session v1 si besoin

    } catch(error) {
        throw error;
    }
}

export async function loginBO(username , passsword) {
    if(username === USERNAME && passsword === PASSWORD) {
        sessionStorage.setItem("bo-token" , "123456789abcdef");
        return "success";
    } else {
        throw new Error("Invalid login or password");
    }
}



export function logoutBO() {
    try {
        sessionStorage.removeItem("user-token");
        sessionStorage.removeItem("refresh-token");
        sessionStorage.removeItem("session-token-v1");
        sessionStorage.removeItem("bo-token");
    } catch(error) {
        throw error;
    } 
}