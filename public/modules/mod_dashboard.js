import { apiGet } from "/assets/js/api.js";

export async function render() {
  return `
    <div class="max-w-5xl mx-auto space-y-6 fade-in pb-10">
        
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
            <div class="absolute -right-10 -top-10 text-9xl text-white opacity-10"><i class="fa-solid fa-star"></i></div>
            <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 class="text-3xl font-black mb-1">Halo, <span id="dash_name">Talent</span>! 👋</h2>
                    <p class="text-blue-100 font-medium text-sm md:text-base">Siap untuk proyek besar Anda selanjutnya?</p>
                    <div class="mt-4 flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl inline-flex border border-white/10">
                        <i class="fa-solid fa-medal text-yellow-400 text-xl"></i>
                        <div>
                            <p class="text-[10px] text-blue-200 uppercase font-bold tracking-widest leading-none">Skor Kredibilitas</p>
                            <p class="font-black text-lg leading-none mt-1" id="dash_score">0 <span class="text-xs font-normal text-blue-200">/ 10.000</span></p>
                        </div>
                    </div>
                </div>
                
                <div class="w-full md:w-64 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                    <div class="flex justify-between items-end mb-2">
                        <span class="text-sm font-bold text-white">Kelengkapan Profil</span>
                        <span class="text-2xl font-black text-yellow-400" id="dash_prog_txt">0%</span>
                    </div>
                    <div class="w-full bg-black/30 rounded-full h-2.5 mb-3 overflow-hidden">
                        <div id="dash_prog_bar" class="bg-gradient-to-r from-yellow-400 to-yellow-300 h-2.5 rounded-full transition-all duration-1000 ease-out" style="width: 0%"></div>
                    </div>
                    <p id="dash_prog_msg" class="text-[10px] text-blue-100 leading-tight">Lengkapi hingga 80% untuk melamar proyek dengan 1-Click.</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div class="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.loadModule('projects', document.querySelector('[onclick*=\\'projects\\']'))">
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xl md:text-2xl"><i class="fa-regular fa-paper-plane"></i></div>
                <div><p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Melamar</p><h4 class="text-xl md:text-2xl font-black text-gray-800" id="stat_applied">0</h4></div>
            </div>
            <div class="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.loadModule('projects', document.querySelector('[onclick*=\\'projects\\']'))">
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-xl md:text-2xl"><i class="fa-regular fa-circle-check"></i></div>
                <div><p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Proyek Diterima</p><h4 class="text-xl md:text-2xl font-black text-gray-800" id="stat_approved">0</h4></div>
            </div>
            <div class="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onclick="window.loadModule('projects', document.querySelector('[onclick*=\\'projects\\']'))">
                <div class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-xl md:text-2xl"><i class="fa-solid fa-envelope-open-text"></i></div>
                <div><p class="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Undangan Langsung</p><h4 class="text-xl md:text-2xl font-black text-gray-800" id="stat_invited">0</h4></div>
            </div>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8">
            <div class="flex justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-800"><i class="fa-solid fa-crosshairs text-red-500 mr-2"></i> Smart Job Matches</h3>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dicocokkan oleh algoritma AI</p>
                </div>
                <button onclick="window.loadModule('projects', document.querySelector('[onclick*=\\'projects\\']'))" class="text-xs md:text-sm font-bold text-primary hover:underline whitespace-nowrap">Lihat Semua</button>
            </div>
            
            <div id="recommended-list" class="space-y-4">
                <div class="text-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-gray-300"></i></div>
            </div>
        </div>

    </div>
  `;
}

export async function initEvents() {
    // Tarik nama dari memory state
    try {
        const { state } = await import("/assets/js/state.js");
        if(state && state.user) {
            document.getElementById("dash_name").textContent = state.user.full_name ? state.user.full_name.split(" ")[0] : "Talent";
        }
    } catch(e) {}

    const res = await apiGet("/functions/api/talent/dashboard_stats");
    
    if (res.ok && res.data) {
        const { stats, recommended } = res.data;

        // Render Statistik
        document.getElementById("dash_score").innerHTML = `${(stats.score || 0).toLocaleString('id-ID')} <span class="text-xs font-normal text-blue-200">/ 10.000</span>`;
        document.getElementById("dash_prog_txt").textContent = `${stats.progress || 0}%`;
        document.getElementById("dash_prog_bar").style.width = `${stats.progress || 0}%`;
        
        if(stats.progress >= 80) {
            document.getElementById("dash_prog_msg").innerHTML = `<i class="fa-solid fa-check-circle text-green-300"></i> Profil Anda memenuhi syarat 1-Click Apply!`;
        }

        document.getElementById("stat_applied").textContent = stats.total_applied || 0;
        document.getElementById("stat_approved").textContent = stats.total_approved || 0;
        document.getElementById("stat_invited").textContent = stats.total_invited || 0;

        // Render Rekomendasi Proyek (Smart Match UI)
        const recContainer = document.getElementById("recommended-list");
        if (!recommended || recommended.length === 0) {
            recContainer.innerHTML = `
            <div class="text-center py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                <i class="fa-solid fa-ghost text-5xl text-gray-200 mb-3"></i>
                <p class="text-gray-500 font-medium text-sm">Belum ada proyek yang cocok dengan profil Anda.</p>
                <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Pastikan profil Anda sudah 100% lengkap.</p>
            </div>`;
        } else {
            recContainer.innerHTML = recommended.map(p => {
                const scoreColor = p.match_score >= 90 ? 'bg-green-500' : (p.match_score >= 70 ? 'bg-blue-500' : 'bg-orange-500');
                const scoreBg = p.match_score >= 90 ? 'bg-green-50 border-green-200' : (p.match_score >= 70 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200');
                const scoreText = p.match_score >= 90 ? 'text-green-700' : (p.match_score >= 70 ? 'text-blue-700' : 'text-orange-700');
                
                return `
                <div class="group border border-gray-200 p-4 md:p-5 rounded-2xl hover:border-primary hover:shadow-lg transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white relative overflow-hidden">
                    <div class="absolute left-0 top-0 bottom-0 w-1.5 ${scoreColor}"></div>
                    
                    <div class="flex-1 pl-2 w-full">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="px-2 py-1 rounded text-[9px] font-black border ${scoreBg} ${scoreText}"><i class="fa-solid fa-bolt"></i> ${p.match_score}% COCOK</span>
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">${p.company_name || 'Client Orland'}</span>
                        </div>
                        <h4 class="font-black text-gray-800 text-base md:text-lg mb-1 leading-tight">${p.project_title}</h4>
                        
                        <div class="bg-gray-50 border border-gray-100 rounded-lg p-3 mt-3 w-full">
                            <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">Dibutuhkan Karakter:</p>
                            <p class="text-xs md:text-sm font-bold text-gray-800"><i class="fa-regular fa-user mr-1 text-primary"></i> ${p.role_name}</p>
                            <p class="text-[10px] md:text-xs text-gray-500 mt-1">Spek: ${p.gender}, Usia ${p.age_min}-${p.age_max}th, Tinggi ${p.height_min}-${p.height_max}cm</p>
                        </div>
                    </div>
                    
                    <div class="w-full md:w-auto mt-2 md:mt-0">
                        <button onclick="import('/modules/mod_projects.js').then(m => m.initEvents().then(() => window.TalentProjects.apply('${p.project_id}', '${p.project_title.replace(/'/g, "\\'")}')))" 
                                class="w-full md:w-auto bg-gray-900 text-white px-5 py-3 rounded-xl font-bold text-xs md:text-sm shadow-md hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2">
                            Lamar Peran Ini <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                `;
            }).join("");
        }

    } else {
        document.getElementById("recommended-list").innerHTML = `<p class="text-center text-red-500 font-bold py-4 text-sm border-2 border-red-100 rounded-xl bg-red-50">Gagal memuat data dashboard.</p>`;
    }
}
