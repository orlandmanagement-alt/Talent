import { apiGet } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";
import { startPolling, stopPolling } from "/assets/js/realtime.js";

let lastCount = 0;

// Fungsi Inti Penarik Data
async function fetchNotifications(containerId, limit = null) {
    const res = await apiGet("/functions/api/notifications");
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!res.ok) { 
        if(!el.innerHTML.includes("Gagal")) el.innerHTML = `<div class="bg-red-50 text-red-500 p-4 rounded-xl text-center text-sm font-medium">Sistem Notifikasi Offline.</div>`; 
        return; 
    }
    
    let items = res.data?.items || res.data || [];
    const count = Array.isArray(items) ? items.length : 0;

    // Bunyikan Toast jika ada notif baru masuk saat polling berjalan
    if (lastCount !== 0 && count > lastCount) {
        notify("Anda memiliki notifikasi baru!", "info");
    }
    lastCount = count;

    if (!count) { 
        el.innerHTML = `<div class="text-center text-gray-400 py-6"><i class="fa-regular fa-bell-slash text-3xl mb-2 opacity-50"></i><p class="text-sm">Tidak ada notifikasi.</p></div>`; 
        return; 
    }
    
    if (limit) items = items.slice(0, limit);

    el.innerHTML = items.map(x => `
        <div class="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-3 items-start last:border-0 rounded cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5"><i class="fa-solid fa-envelope text-xs"></i></div>
            <div>
                <div class="font-bold text-gray-800 text-sm">${x.title || x.type || "Info Sistem"}</div>
                <div class="text-xs text-gray-500 mt-1 line-clamp-2">${x.body || ""}</div>
            </div>
        </div>
    `).join("");
}

// --- MODE: HALAMAN PENUH ---
export async function render() {
  return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto min-h-[60vh]">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4"><i class="fa-solid fa-bell text-primary mr-2"></i> Kotak Masuk Notifikasi</h2>
        <div id="full-notif-list" class="space-y-1">
            <div class="flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-primary"></i></div>
        </div>
    </div>
  `;
}

export async function initEvents() {
  // Tarik data setiap 15 detik untuk halaman penuh
  startPolling(() => fetchNotifications("full-notif-list"), 15000);
}

// --- MODE: WIDGET UNTUK DASHBOARD ---
export async function renderWidget(containerId) {
  // Tarik data setiap 30 detik untuk widget dashboard (maksimal 4 notif)
  startPolling(() => fetchNotifications(containerId, 4), 30000);
}

// Bersihkan polling saat modul diganti agar memori tidak bocor
window.addEventListener("hashchange", stopPolling); 
