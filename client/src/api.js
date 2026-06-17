const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const createLink = async (originalUrl, customAlias) => {
  const res = await fetch(`${API_BASE_URL}/api/urls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ originalUrl, customAlias }),
  });
  return res.json();
};

export const fetchLinks = async () => {
  const res = await fetch(`${API_BASE_URL}/api/urls`);
  return res.json();
};

export const fetchAnalytics = async (shortCode) => {
  const res = await fetch(`${API_BASE_URL}/api/urls/${shortCode}/analytics`);
  return res.json();
};