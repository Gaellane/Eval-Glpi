import { apiCall, v1Headers, v2Headers } from "../../services/api/api";

const BASE_URL = import.meta.env.VITE_BACKEND_GLPI_URL;
const v1_endpoint = BASE_URL+'/v1/User';




export function createUSer(username , id = null) {
    let user = {username : username , realname : username};
    if(id) {
        user.id = id;
    }
    return user;
}

export async function save(user) {
    const url = v1_endpoint;
    const headers = v1Headers('application/json');

    const username = typeof user === 'string' ? user : (user.username || user.name || user.login || user?.username);
    const realname = (user && (user.realname || user.name)) || username;

    const body = { input: [{ name: username, realname: realname }] };
    try {
        const response = await apiCall(url, 'POST', headers, body );
        const created = Array.isArray(response) ? response[0] : response;
        const id = created?.id || created?.ID || created?.Id || null;
        const returnedName = created?.name || username;
        return createUSer(returnedName, id);
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

export async function saveMultiple(users) {
    try {
        const results = [];
        for (const u of users) {
            const toSave = (typeof u === 'string') ? u : (u.username || u.name || u);
            results.push(await save(toSave));
        }
        return results;
    } catch (error) {
        console.error('Error saving multiple users:', error);
        throw error;
    }
}

