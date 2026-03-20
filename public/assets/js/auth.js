import config from "./config.js";

export async function checkSession() {
    try {
        // Kita tembak ke API Utama untuk verifikasi cookie secara mutlak
        const res = await fetch(`${config.API_BASE}/functions/api/auth/me`, { 
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
        // Jangan langsung lempar ke SSO, lempar ke Landing Page sendiri untuk memutus loop!
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
