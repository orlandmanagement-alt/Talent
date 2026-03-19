import { apiGet } from "/assets/js/api.js";
import { createCard } from "/assets/js/ui.js";
import { renderBarChart } from "/assets/js/chart.js";
import { renderWidget as renderNotifWidget } from "/modules/mod_notifications.js";
import { renderWidget as renderSessionWidget } from "/modules/mod_session_management.js";

export async function render() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="kpi-container">
      <div class="col-span-full flex justify-center py-4"><i class="fa-solid fa-spinner fa-spin text-3xl text-primary"></i></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold mb-6 text-gray-800"><i class="fa-solid fa-chart-column text-primary mr-2"></i> Aktivitas Proyek</h3>
        <div id="chart-container" class="mt-4">
            <div class="flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-gray-300 text-3xl"></i></div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold mb-4 text-gray-800 border-b border-gray-100 pb-3"><i class="fa-solid fa-bell text-orange-400 mr-2"></i> Notifikasi Terbaru</h3>
          <div id="notif-container" class="space-y-1">Memuat notifikasi...</div>
        </div>
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 class="text-lg font-bold text-gray-800"><i class="fa-solid fa-shield-halved text-green-500 mr-2"></i> Perangkat Aktif</h3>
            <button onclick="window.logoutAllSessions()" class="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-100">Logout Semua</button>
          </div>
          <div id="session-container" class="space-y-1">Memuat sesi...</div>
        </div>
      </div>
    </div>
  `;
}

export async function initEvents() {
  console.log("Dashboard Events Loading...");
  
  // 1. Load KPI & Chart
  const res = await apiGet("/functions/api/dashboard_summary");
  const kpiEl = document.getElementById("kpi-container");
  
  if (res.ok && res.data) {
    const d = res.data;
    kpiEl.innerHTML = `
      ${createCard("Total Proyek", d.projects || 0, "fa-solid fa-briefcase", "blue")}
      ${createCard("Lamaran Aktif", d.applications || 0, "fa-solid fa-paper-plane", "green")}
      ${createCard("Jadwal Booking", d.bookings || 0, "fa-solid fa-calendar-check", "purple")}
      ${createCard("Pendapatan", "$" + (d.earnings || 0), "fa-solid fa-wallet", "orange")}
    `;
    
    // Render Chart
    const chartData = [
      { label: "Proyek Selesai", value: d.projects || 15 },
      { label: "Lamaran Terkirim", value: d.applications || 28 },
      { label: "Booking Diterima", value: d.bookings || 8 }
    ];
    document.getElementById("chart-container").innerHTML = ""; // Clear spinner
    renderBarChart("chart-container", chartData);
  } else {
    kpiEl.innerHTML = `<div class="col-span-full text-red-500 font-medium">Gagal memuat Ringkasan Dashboard.</div>`;
  }

  // 2. Load Widgets (Tanpa memblokir satu sama lain)
  renderNotifWidget("notif-container");
  renderSessionWidget("session-container");
}
