import config from "./config.js";

export async function checkSession() {
    try {
        // PERBAIKAN: Di Cloudflare Pages, folder 'functions/api' diakses via '/api' (tanpa 'functions')
        const endpoint = `${config.API_BASE}/api/auth/me`;

        const res = await fetch(endpoint, { 
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!res.ok) return null;
        const data = await res.json();
        return data.user || null;
    } catch (e) {
        console.error("Session Check Failed:", e);
        return null;
    }
}

export async function requireAuth(expectedRole = 'talent') {
    const user = await checkSession();
    if (!user || user.role !== expectedRole) {
        sessionStorage.setItem('auth_error', 'Sesi Anda telah habis atau akses ditolak.');
        window.location.href = '/index.html'; 
        return null;
    }
    return user;
}

export async function logout() {
    try {
        await fetch(`${config.SSO_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch(e) {}
    window.location.href = '/index.html';
}
