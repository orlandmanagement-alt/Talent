import config from "./config.js";

async function safeFetch(endpoint, options = {}){
  try {
    const res = await fetch(config.API_BASE + endpoint, {
      credentials: "include", // WAJIB: Membawa tiket cookie ke API Server
      ...options
    });

    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch {}

    // Jika API merespons 401 (Unauthorized/Sesi Habis), otomatis tendang ke SSO
    if (res.status === 401) {
        window.location.href = config.SSO_URL;
        return { ok: false, data: { message: "Sesi Habis" }};
    }

    return { ok: res.ok, status: res.status, data };

  } catch(e) {
    return { ok: false, status: 500, data: { message: "network_error" } };
  }
}

export const apiGet = (url) => safeFetch(url);
export const apiPost = (url, body) => safeFetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});
