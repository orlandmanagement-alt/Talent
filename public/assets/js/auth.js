import config from "./config.js";
import { state } from "./state.js"; 

// 1. Cek Sesi ke Server SSO
export async function checkSession() {
    try {
        // PENTING: credentials "include" memastikan Cookie Sesi SSO terbaca di sini
        const res = await fetch(`${config.SSO_URL}/api/auth/me`, {
            credentials: "include" 
        });
        
        if (!res.ok) return null;
        
        const data = await res.json();
        return data.user || null;
    } catch (e) {
        return null;
    }
}

// 2. Lempar ke SSO jika belum login
export function redirectToSSO() {
    window.location.href = config.SSO_URL;
}

// 3. Fungsi Guard (Gunakan ini di dashboard.html Anda)
export async function requireAuth(expectedRole = null) {
    const user = await checkSession();
    
    // Jika tidak ada cookie sesi yang valid -> Tendang ke SSO
    if (!user) {
        redirectToSSO();
        return false;
    }

    // Jika Role tidak sesuai dengan Portal (Misal: Client mencoba buka portal Talent)
    if (expectedRole && user.role !== expectedRole && user.role !== 'admin') {
        const correctUrl = user.role === 'client' ? 'https://client.orlandmanagement.com' : 'https://talent.orlandmanagement.com';
        window.location.href = correctUrl;
        return false;
    }

    // Simpan data user ke state global jika lolos
    if (state) state.user = user; 
    return user;
}

// 4. Logout Terpusat
export async function logout() {
    await fetch(`${config.SSO_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    redirectToSSO();
}
