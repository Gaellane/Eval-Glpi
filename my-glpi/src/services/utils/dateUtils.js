export function formatDateForGlpi(date, time = null) {
    if (!date) return null;

    // Combiner date et heure si séparées
    const raw = time ? `${date} ${time}` : date;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return null;

    const pad = n => String(n).padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}