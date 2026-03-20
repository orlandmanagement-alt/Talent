import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";

export async function render() {
  return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto min-h-[75vh]">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div><h2 class="text-2xl font-bold text-gray-800"><i class="fa-solid fa-briefcase text-primary mr-2"></i> Bursa Proyek</h2></div>
        </div>
        <div class="flex gap-6 border-b border-gray-100 mb-6">
            <button id="tab-explore" class="pb-3 text-sm font-bold text-primary border-b-2 border-primary transition-colors">Cari Proyek Baru</button>
            <button id="tab-my-apps" class="pb-3 text-sm font-bold text-gray-400 hover:text-gray-600 border-b-2 border-transparent transition-colors">Riwayat Lamaran</button>
        </div>
        <div id="projects-content" class="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in"></div>
    </div>
  `;
}

export async function initEvents() {
    const tabExplore = document.getElementById("tab-explore");
    const tabMyApps = document.getElementById("tab-my-apps");
    const content = document.getElementById("projects-content");

    async function loadExplore() {
        tabExplore.className = "pb-3 text-sm font-bold text-primary border-b-2 border-primary";
        tabMyApps.className = "pb-3 text-sm font-bold text-gray-400 border-b-2 border-transparent";
        content.innerHTML = `<div class="col-span-full flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-primary"></i></div>`;

        const res = await apiGet("/functions/api/talent/projects_list");
        if (!res.ok) { content.innerHTML = `<div class="col-span-full text-red-500 text-center font-medium p-4">Gagal memuat proyek.</div>`; return; }
        
        const items = res.data?.items || [];
        if (!items.length) { content.innerHTML = `<div class="col-span-full text-center py-16 text-gray-400">Belum ada lowongan.</div>`; return; }

        content.innerHTML = items.map(p => `
            <div class="border border-gray-200 p-6 rounded-2xl hover:shadow-xl transition-all bg-white flex flex-col h-full">
                <h3 class="font-bold text-lg text-gray-800 mb-2">${p.title}</h3>
                <p class="text-xs text-gray-500 mb-4"><i class="fa-solid fa-location-dot"></i> ${p.location || 'TBA'}</p>
                <p class="text-sm text-gray-600 mb-6 flex-1 line-clamp-3">${p.description}</p>
                <button onclick="window.TalentProjects.apply('${p.id}', '${p.title.replace(/'/g, "\\'")}')" class="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-600">
                    Lamar Sekarang
                </button>
            </div>
        `).join("");
    }

    async function loadMyApps() {
        tabMyApps.className = "pb-3 text-sm font-bold text-primary border-b-2 border-primary";
        tabExplore.className = "pb-3 text-sm font-bold text-gray-400 border-b-2 border-transparent";
        content.innerHTML = `<div class="col-span-full flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-primary"></i></div>`;
        const res = await apiGet("/functions/api/talent/my_applications");
        if (!res.ok) return;
        const items = res.data?.items || [];
        if (!items.length) { content.innerHTML = `<div class="col-span-full text-center py-16 text-gray-400">Anda belum melamar proyek apapun.</div>`; return; }
        
        content.innerHTML = items.map(a => `
            <div class="border border-gray-200 p-5 rounded-2xl bg-white flex flex-col h-full shadow-sm">
                <h3 class="font-bold text-lg text-gray-800">${a.title}</h3>
                <span class="text-[10px] font-black uppercase text-gray-500 mt-1">Status: ${a.application_status}</span>
            </div>
        `).join("");
    }

    window.TalentProjects = {
        apply: async (projectId, projectTitle) => {
            notify("Mengecek kelengkapan profil Anda...", "info");
            
            // GERBANG 80%: Ambil Data Profil
            const profRes = await apiGet("/functions/api/talent/profile_get");
            if (!profRes.ok) return notify("Gagal memverifikasi profil", "error");
            
            const progress = profRes.data?.profile_progress || 0;
            
            if (progress < 80) {
                notify(`Profil Anda baru ${progress}%. Wajib lengkapi minimal 80% (Termasuk Foto & Nama) untuk melamar!`, "error", 6000);
                // Bawa mereka ke menu Profil secara otomatis
                setTimeout(() => {
                    window.loadModule('profile', document.querySelector('[onclick*="profile"]'));
                }, 1500);
                return;
            }

            if(!confirm(`Apakah Anda yakin ingin melamar proyek: "${projectTitle}"?`)) return;
            notify("Memproses lamaran...", "info");
            const res = await apiPost("/functions/api/talent/project_apply", { project_id: projectId });
            if(res.ok) { notify("Berhasil melamar!", "success"); loadMyApps(); } 
            else { notify(res.data?.message || "Gagal melamar", "error"); }
        }
    };

    tabExplore.addEventListener("click", loadExplore);
    tabMyApps.addEventListener("click", loadMyApps);

    // DEEP LINK AUTO-TRIGGER
    const pendingProject = localStorage.getItem('pending_apply_project');
    if (pendingProject) {
        localStorage.removeItem('pending_apply_project'); // Hapus agar tidak terus-terusan trigger
        // Panggil fungsi apply secara otomatis untuk proyek tersebut
        // Karena kita tidak tahu judulnya di memori, kita pakai placeholder
        setTimeout(() => window.TalentProjects.apply(pendingProject, "Proyek Undangan"), 1000);
        loadExplore(); // Tetap render layarnya
    } else {
        loadExplore();
    }
}
