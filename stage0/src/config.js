export const PORT = process.env.PORT || 3000;
export const GENDERIZE_URL = process.env.GENDERIZE_URL || 'https://api.genderize.io/';
export const UPSTREAM_TIMEOUT_MS = Number.parseInt(process.env.UPSTREAM_TIMEOUT_MS) || 4500;