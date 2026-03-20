import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";

export async function render() {
  return `
    
    <div id="role-select-modal" class="fixed inset-0 z-[99999] hidden flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="document.getElementById('role-select-modal').classList.add('hidden')"></div>
        <div class="bg-white rounded-3xl w-[95%] max-w-lg max-h-[90vh] flex flex-col relative z-10 shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-black text-gray-800 leading-tight">Pilih Peran (Casting)</h3>
                    <p class="text-xs text-gray-500 mt-1">Anda bisa melamar lebih dari 1 peran sekaligus.</p>
                </div>
                <button onclick="document.getElementById('role-select-modal').classList.add('hidden')" class="w-8 h-8 bg-gray-200 hover:bg-red-100 hover:text-red-600 rounded-full font-bold transition-colors"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1 bg-white" id="role-checkbox-list">
                </div>
            
            <div class="p-6 border-t border-gray-100 bg-white">
                <input type="hidden" id="apply_project_id">
                <button onclick="window.TalentProjects.submitRoles()" class="w-full bg-gray-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-black active:scale-95 transition-all text-lg"><i class="fa-solid fa-paper-plane mr-2"></i> Kirim Lamaran</button>
            </div>
        </div>
    </div>

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
            <div class="border border-gray-200 p-5 md:p-6 rounded-2xl hover:shadow-xl transition-all bg-white flex flex-col h-full relative overflow-hidden group">
        <div class="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex justify-between items-start mb-2 gap-2">
        <h3 class="font-black text-gray-800 text-lg leading-tight">${p.title}</h3>
     </div>
                <div class="flex flex-wrap gap-2 mb-4">
        <span class="bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold"><i class="fa-solid fa-location-dot"></i> ${p.location || 'TBA'}</span>
        <span class="bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold"><i class="fa-regular fa-calendar"></i> ${p.event_date || 'TBA'}</span>
    </div>
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
            const profRes = await apiGet("/functions/api/talent/profile_get");
            if (!profRes.ok) return notify("Gagal memverifikasi profil", "error");
            if ((profRes.data?.profile_progress || 0) < 80) {
                notify("Profil wajib 80% untuk melamar!", "error", 6000);
                setTimeout(() => window.loadModule('profile', document.querySelector('[onclick*="profile"]')), 1500);
                return;
            }

            document.getElementById("apply_project_id").value = projectId;
            const modal = document.getElementById("role-select-modal");
            const list = document.getElementById("role-checkbox-list");
            list.innerHTML = `<div class="text-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-primary"></i></div>`;
            modal.classList.remove("hidden");

            const res = await apiGet(`/functions/api/talent/project_roles?id=${projectId}`);
            if (res.ok && res.data && res.data.items.length > 0) {
                const hasScript = res.data.items.some(r => r.script_link);
                let html = hasScript ? `
                    <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800 text-xs mb-4 flex gap-3 items-center">
                        <i class="fa-solid fa-circle-exclamation text-2xl"></i>
                        <p class="font-bold">Proyek ini membutuhkan Audisi Video (Self-Tape). Pastikan Anda merekam video sesuai naskah (Sides) sebelum melamar.</p>
                    </div>
                ` : '';

                html += res.data.items.map(r => {
                    const scoreColor = r.match_score >= 90 ? 'text-green-600 bg-green-50 border-green-200' : (r.match_score >= 70 ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-orange-600 bg-orange-50 border-orange-200');
                    const scriptBtn = r.script_link ? `
                        <a href="${r.script_link}" target="_blank" class="inline-block mt-2 bg-white border-2 border-primary text-primary px-3 py-1 rounded-lg text-[10px] font-black hover:bg-blue-50">
                            <i class="fa-solid fa-file-pdf mr-1"></i> Unduh Naskah (Sides)
                        </a>
                    ` : '';

                    return `
                    <label class="flex items-start gap-4 p-4 border border-gray-200 rounded-2xl mb-3 cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-gray-800 has-[:checked]:bg-gray-50 overflow-hidden relative">
                        <div class="pt-1">
                            <input type="checkbox" name="selected_roles" value="${r.id}" class="w-5 h-5 accent-gray-900 rounded role-check-box" onchange="window.TalentProjects.toggleVideoInput(this)">
                        </div>
                        <div class="flex-1 w-full">
                            <div class="flex justify-between items-start mb-1">
                                <h4 class="font-black text-gray-800 text-base">${r.role_name}</h4>
                                <span class="px-2 py-1 rounded text-[9px] font-black border ${scoreColor}"><i class="fa-solid fa-bolt"></i> ${r.match_score}% COCOK</span>
                            </div>
                            <p class="text-xs text-gray-500"><i class="fa-solid fa-users"></i> ${r.gender} | ${r.age_min}-${r.age_max}th | ${r.height_min}-${r.height_max}cm</p>
                            ${scriptBtn}
                            
                            <div class="video-link-container hidden mt-4 pt-4 border-t border-gray-100" id="vid_cont_${r.id}">
                                <label class="block text-[10px] font-black text-gray-600 uppercase mb-1.5"><i class="fa-solid fa-video text-red-500"></i> Link Video Audisi (YouTube/Google Drive) <span class="text-red-500">*</span></label>
                                <input type="url" id="vid_link_${r.id}" class="video-link-input w-full border border-gray-300 rounded-lg p-2.5 text-xs outline-none focus:border-red-500" placeholder="https://www.youtube.com/watch?v=...">
                            </div>
                        </div>
                    </label>
                    `;
                }).join("");
                list.innerHTML = html;
            } else {
                list.innerHTML = `<div class="text-center py-10 text-gray-400 font-bold border-2 border-dashed rounded-2xl">Proyek ini tidak memiliki peran spesifik. Hubungi Admin.</div>`;
            }
        },
        toggleVideoInput: (checkbox) => {
            const roleId = checkbox.value;
            const container = document.getElementById(`vid_cont_${roleId}`);
            const input = document.getElementById(`vid_link_${roleId}`);
            if(checkbox.checked) {
                container.classList.remove('hidden');
                input.required = true;
            } else {
                container.classList.add('hidden');
                input.required = false;
                input.value = ''; // Reset value jika batal centang
            }
        },
        submitRoles: async () => {
            const pId = document.getElementById("apply_project_id").value;
            const checkboxes = document.querySelectorAll('input[name="selected_roles"]:checked');
            
            if(checkboxes.length === 0) return notify("Pilih minimal 1 peran (karakter)!", "error");
            
            let applications = [];
            let missingVideo = false;

            checkboxes.forEach(cb => {
                const roleId = cb.value;
                const videoLink = document.getElementById(`vid_link_${roleId}`).value.trim();
                
                if(!videoLink || !videoLink.startsWith('http')) {
                    missingVideo = true;
                    document.getElementById(`vid_link_${roleId}`).classList.add('border-red-500', 'bg-red-50');
                } else {
                    document.getElementById(`vid_link_${roleId}`).classList.remove('border-red-500', 'bg-red-50');
                    applications.push({ role_id: roleId, video_link: videoLink });
                }
            });

            if(missingVideo) return notify("Harap lengkapi Link Video Audisi untuk peran yang Anda pilih!", "error");
            
            notify("Mengirim Lamaran & Video...", "info");
            const res = await apiPost("/functions/api/talent/project_apply", { project_id: pId, applications: applications });
            if(res.ok) { 
                notify(res.message, "success"); 
                document.getElementById('role-select-modal').classList.add('hidden');
                loadMyApps(); 
            } else { 
                notify(res.data?.message || "Gagal melamar", "error"); 
            }
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
