import { createUSer, saveMultiple } from "../../models/administration/User";

export async function createUser(file) {
    try {
        const users = getUsers(file);
        const savedUsers = await saveMultiple(users);
        return savedUsers;
    } catch (error) {
        console.error("Error creating users:", error);
        throw error;
    }
}

function getUsers(file) {
    try {
        if (!Array.isArray(file)) return [];

        const norm = v => (v && typeof v === 'string') ? v.trim() : null;

        // Extract candidate usernames from common possible keys, fall back to email local-part
        const candidateNames = file.map(row => {
            return norm(
                row.user || row.username || row.name || row.login || (row.email ? String(row.email).split('@')[0] : null)
            );
        }).filter(Boolean);

        // Deduplicate
        const uniqueNames = Array.from(new Set(candidateNames));

        // Map to createUSer objects
        return uniqueNames.map(name => createUSer(name));
    } catch (error) {
        console.error("Error extracting users from file:", error);
        throw error;
    }
}
