import { apiPost } from "/assets/js/api.js";

export async function render(params) {
    return `
    <div class="p-6 max-w-sm mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Presensi Lokasi</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Proyek: ${params.projectName || 'Shooting Day'}</p>
        </div>

        <div class="bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col items-center gap-8 relative overflow-hidden">
            <div id="status-icon" class="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-3xl text-slate-200">
                <i class="fa-solid fa-location-dot"></i>
            </div>

            <div class="text-center space-y-1">
                <p id="geo-status" class="text-[10px] font-black text-slate-400 uppercase">Mencari Koordinat...</p>
                <p id="current-time" class="text-2xl font-black text-slate-800">00:00:00</p>
            </div>

            <button id="btn-checkin" disabled onclick="window.doCheckIn('${params.projectId}')" 
                    class="w-full bg-slate-100 text-slate-400 py-5 rounded-[2.5rem] font-black text-[10px] uppercase transition-all">
                Check-in Sekarang
            </div>
        </div>
        
        <p class="text-[9px] text-center text-slate-400 font-bold px-4 italic">Pastikan GPS aktif. Lokasi Anda akan dicatat sebagai bukti kehadiran resmi.</p>
    </div>`;
}

export async function initEvents(params) {
    const btn = document.getElementById('btn-checkin');
    const geoStatus = document.getElementById('geo-status');
    const icon = document.getElementById('status-icon');

    // Update Jam
    setInterval(() => {
        document.getElementById('current-time').textContent = new Date().toLocaleTimeString('id-ID');
    }, 1000);

    // Get Location
    navigator.geolocation.getCurrentPosition((pos) => {
        window.currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        geoStatus.textContent = "📍 Lokasi Terkunci";
        geoStatus.classList.replace('text-slate-400', 'text-emerald-500');
        icon.classList.replace('bg-slate-50', 'bg-emerald-50');
        icon.classList.replace('text-slate-200', 'text-emerald-500');
        btn.disabled = false;
        btn.classList.replace('bg-slate-100', 'bg-slate-900');
        btn.classList.replace('text-slate-400', 'text-white');
    }, (err) => {
        geoStatus.textContent = "❌ Gagal Akses GPS";
        alert("Mohon izinkan akses lokasi untuk melakukan presensi.");
    });

    window.doCheckIn = async (projectId) => {
        const res = await apiPost('/api/talent/check_in', {
            project_id: projectId,
            lat: window.currentPos.lat,
            lng: window.currentPos.lng,
            loc_name: "Lokasi Shooting"
        });
        if(res.ok) {
            alert(res.message);
            location.hash = '#dashboard';
        }
    };
}
