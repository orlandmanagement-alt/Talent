import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";
import config from "/assets/js/config.js";

// Digunakan sebagai Widget di Dashboard
export async function renderWidget(containerId) {
  const el = document.getElementById(containerId);
  if(!el) return;
  
  const res = await apiGet("/functions/api/auth/sessions");
  if(!res.ok) { el.innerHTML = "<p class='text-red-500 text-sm'>Gagal memuat sesi.</p>"; return; }
  
  const items = res.data?.items || res.data || [];
  if(!items.length) { el.innerHTML = "<p class='text-gray-400 italic text-sm'>Tidak ada sesi tambahan.</p>"; return; }

  el.innerHTML = items.map((item, idx) => `
    <div class="border-b border-gray-100 py-3 last:border-0 flex justify-between items-center hover:bg-gray-50 px-2 rounded -mx-2 transition-colors">
        <div>
            <div class="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <i class="fa-solid ${idx === 0 ? 'fa-laptop text-primary' : 'fa-mobile-screen text-gray-400'}"></i>
                ${item.device_info || item.device_name || (idx === 0 ? "Perangkat Saat Ini" : "Perangkat Lain")}
            </div>
            <div class="text-xs text-gray-500 mt-1">Berakhir: ${item.expires_at || "Sesi Panjang"}</div>
        </div>
        ${idx !== 0 ? `<button onclick="window.revokeDeviceSession('${item.id || item.session_id}')" class="text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">Cabut</button>` : `<span class="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">Aktif</span>`}
    </div>
  `).join("");
}

// Global Function untuk aksi dari HTML
window.revokeDeviceSession = async function(id) {
    const res = await apiPost("/functions/api/auth/revoke_session", { session_id: id });
    if(res.ok) {
        notify("Sesi perangkat berhasil dicabut.", "success");
        renderWidget("session-container"); // Reload list
    } else { notify("Gagal mencabut sesi.", "error"); }
}

window.logoutAllSessions = async function() {
    const res = await apiPost("/functions/api/auth/logout_all", {});
    if(res.ok) {
        notify("Semua sesi diakhiri. Mengalihkan...", "success");
        setTimeout(() => window.location.href = config.SSO_URL, 1500);
    } else { notify("Gagal logout dari perangkat lain.", "error"); }
}
