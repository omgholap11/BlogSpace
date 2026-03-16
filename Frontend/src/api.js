const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";

export const API_BASE_URL =
  rawApiBaseUrl.length > 1 && rawApiBaseUrl.endsWith("/")
    ? rawApiBaseUrl.slice(0, -1)
    : rawApiBaseUrl;

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}