export function formatNumber(value) {
    return Number(value.trim().replace(/,/g, '.'));
}