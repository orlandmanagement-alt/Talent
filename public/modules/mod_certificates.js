import { apiGet } from "/assets/js/api.js";

export async function render() {
  return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto min-h-[75vh]">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-100 pb-6">
            <div>
                <h2 class="text-2xl font-bold text-gray-800"><i class="fa-solid fa-award text-yellow-500 mr-2"></i> Sertifikat Pengalaman</h2>
                <p class="text-sm text-gray-500 mt-1">Koleksi kredensial digital dari proyek yang telah Anda selesaikan.</p>
            </div>
        </div>
        
        <div id="cert-list" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="col-span-full flex justify-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-primary"></i></div>
        </div>
    </div>
  `;
}

export async function initEvents() {
  const res = await apiGet("/functions/api/talent/certificates_list");
  const el = document.getElementById("cert-list");
  
  if(!res.ok) {
      el.innerHTML = `<div class="col-span-full bg-red-50 text-red-500 text-center font-medium p-4 rounded-xl">Gagal memuat daftar sertifikat.</div>`; return;
  }

  const items = res.data?.items || [];
  if(!items.length) {
      el.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center text-gray-400 py-16">
          <i class="fa-solid fa-file-shield text-6xl mb-4 text-gray-200"></i>
          <p class="font-medium text-gray-500">Anda belum memiliki sertifikat proyek.</p>
          <p class="text-xs mt-1">Selesaikan proyek dan minta Client untuk menerbitkannya.</p>
      </div>`;
      return;
  }

  // Render Sertifikat Bergaya Tiket/Kredensial Premium
  el.innerHTML = items.map(c => {
      const dateStr = new Date(c.issue_date * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      return `
      <div class="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl overflow-hidden group hover:scale-[1.02] transition-transform">
          <div class="absolute -right-10 -top-10 text-9xl text-white opacity-5"><i class="fa-solid fa-award"></i></div>
          <div class="absolute left-0 top-0 w-2 h-full bg-yellow-500"></div>
          
          <div class="relative z-10">
              <div class="flex justify-between items-start mb-6">
                  <div>
                      <p class="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">CERTIFICATE OF PARTICIPATION</p>
                      <h3 class="text-xl font-black text-yellow-400 leading-tight">${c.project_title}</h3>
                  </div>
                  <div class="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                      <p class="text-[10px] text-gray-300 font-mono tracking-wider">NO: ${c.certificate_no}</p>
                  </div>
              </div>
              
              <div class="mb-6">
                  <p class="text-xs text-gray-400 mb-1">Diberikan oleh:</p>
                  <p class="text-sm font-bold">${c.company_name}</p>
              </div>
              
              <div class="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                  <div>
                      <p class="text-[10px] text-gray-400 uppercase">Tanggal Terbit</p>
                      <p class="text-xs font-bold">${dateStr}</p>
                  </div>
                  <button class="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-xs font-black shadow-lg hover:bg-yellow-400 transition-colors">
                      <i class="fa-solid fa-download mr-1"></i> Unduh PDF
                  </button>
              </div>
          </div>
      </div>
      `;
  }).join("");
}
