import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                <h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-magnifying-glass text-primary mr-2"></i> Bursa Proyek</h2>
                <p class="text-[13px] text-gray-500 mt-1">Temukan dan lamar casting terbaru.</p>
            </div>
            
            <div class="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                <button onclick="window.TalentProjects.switchTab('new')" id="tab-new" class="proj-tab flex-1 md:flex-none px-4 py-1.5 bg-white shadow-sm rounded-md text-[12px] font-bold text-gray-800 transition-all">Cari Proyek Baru</button>
                <button onclick="window.TalentProjects.switchTab('history')" id="tab-history" class="proj-tab flex-1 md:flex-none px-4 py-1.5 rounded-md text-[12px] font-bold text-gray-500 hover:text-gray-800 transition-all">Riwayat Lamaran</button>
            </div>
        </div>

        <div id="project-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
            <div class="col-span-full py-20 text-center"><i class="fa-solid fa-spinner fa-spin text-3xl text-gray-300"></i></div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    window.TalentProjects = {
        switchTab: (tab) => {
            document.querySelectorAll('.proj-tab').forEach(b => {
                b.className = "proj-tab flex-1 md:flex-none px-4 py-1.5 rounded-md text-[12px] font-bold text-gray-500 hover:text-gray-800 transition-all";
            });
            document.getElementById(`tab-${tab}`).className = "proj-tab flex-1 md:flex-none px-4 py-1.5 bg-white shadow-sm rounded-md text-[12px] font-bold text-gray-800 transition-all";
            
            window.TalentProjects.fetchProjects(tab);
        },
        
        fetchProjects: async (tab) => {
            const container = document.getElementById("project-container");
            container.innerHTML = `<div class="col-span-full py-20 text-center"><i class="fa-solid fa-spinner fa-spin text-3xl text-gray-300"></i></div>`;
            
            try {
                // Simulasi pemanggilan API (Ganti dengan endpoint Anda yang sebenarnya nanti)
                const res = await apiGet(`/functions/api/talent/projects?type=${tab}`);
                
                // JIKA API ERROR ATAU DATA KOSONG: Jangan Tampilkan Error, Tampilkan "Empty State" yang Cantik
                if (!res.ok || !res.data || res.data.length === 0) {
                    const msg = tab === 'new' ? 'Belum ada proyek casting baru yang tersedia saat ini.' : 'Anda belum melamar ke proyek manapun.';
                    const icon = tab === 'new' ? 'fa-clapperboard' : 'fa-folder-open';
                    
                    container.innerHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <i class="fa-solid ${icon} text-5xl text-gray-300 mb-4"></i>
                        <h3 class="text-base font-bold text-gray-700">Tidak Ada Proyek</h3>
                        <p class="text-[13px] text-gray-500 mt-1">${msg}</p>
                    </div>`;
                    return;
                }

                // Jika ada data, render di sini (Contoh Render Card)
                container.innerHTML = res.data.map(p => `
                    <div class="border border-gray-200 p-4 rounded-xl bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <div class="text-[10px] font-bold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded uppercase mb-2">Casting</div>
                        <h4 class="font-bold text-gray-800 mb-1 line-clamp-2">${p.title}</h4>
                        <p class="text-[12px] text-gray-500 line-clamp-2 mb-4">${p.description}</p>
                        <button class="w-full bg-gray-900 text-white text-[12px] font-bold py-2 rounded-lg hover:bg-black">Lihat Detail</button>
                    </div>
                `).join('');

            } catch (e) {
                container.innerHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl border-2 border-dashed border-red-200">
                        <i class="fa-solid fa-wifi text-4xl text-red-300 mb-3"></i>
                        <h3 class="text-sm font-bold text-red-600">Koneksi Terputus</h3>
                        <p class="text-[12px] text-red-400 mt-1">Gagal menghubungi server proyek.</p>
                    </div>`;
            }
        }
    };

    // Muat tab awal
    window.TalentProjects.fetchProjects('new');
}
