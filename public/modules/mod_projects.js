import { apiGet } from "/assets/js/api.js";

export async function render() {
  return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
            <div>
                <h2 class="text-2xl font-bold text-gray-800"><i class="fa-solid fa-briefcase text-primary mr-2"></i> Proyek Saya</h2>
                <p class="text-sm text-gray-500 mt-1">Kelola dan pantau status pekerjaan Anda.</p>
            </div>
            <button class="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2">
                <i class="fa-solid fa-plus"></i> Cari Proyek Baru
            </button>
        </div>
        
        <div id="project-list" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-full flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-primary"></i></div>
        </div>
    </div>
  `;
}

export async function initEvents() {
  const res = await apiGet("/functions/api/talent/projects_list");
  const el = document.getElementById("project-list");
  
  if(!res.ok) {
      el.innerHTML = `<div class="col-span-full bg-red-50 text-red-500 text-center font-medium p-4 rounded-xl">Gagal memuat daftar proyek.</div>`;
      return;
  }

  const items = res.data?.items || res.data || [];
  if(!items.length) {
      el.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center text-gray-400 py-16">
          <i class="fa-solid fa-folder-open text-6xl mb-4 text-gray-200"></i>
          <p class="font-medium text-gray-500">Anda belum memiliki proyek aktif.</p>
      </div>`;
      return;
  }

  el.innerHTML = items.map(p => `
      <div class="border border-gray-200 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full ${p.status === 'Selesai' ? 'bg-green-400' : 'bg-primary'}"></div>
          <div class="flex justify-between items-start mb-3">
              <h3 class="font-bold text-lg text-gray-800 leading-tight">${p.title || "Nama Proyek " + p.id}</h3>
              <span class="px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full uppercase tracking-wide whitespace-nowrap">${p.status || "Aktif"}</span>
          </div>
          <p class="text-sm text-gray-500 mb-5 line-clamp-2">${p.description || "Deskripsi singkat mengenai proyek ini akan ditampilkan di sini untuk memberikan konteks cepat."}</p>
          <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
              <div class="text-xs text-gray-400 font-medium"><i class="fa-regular fa-clock mr-1"></i> Terakhir diupdate</div>
              <button class="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">Detail <i class="fa-solid fa-arrow-right ml-1 text-xs"></i></button>
          </div>
      </div>
  `).join("");
}
