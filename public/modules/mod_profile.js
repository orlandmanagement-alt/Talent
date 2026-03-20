import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[75vh]">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 class="text-xl font-bold text-gray-800"><i class="fa-solid fa-user-pen text-primary mr-2"></i> Profil & Portofolio</h2>
            <button class="bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-blue-600">Simpan Profil</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1 flex flex-col items-center">
                <div class="w-32 h-32 bg-gray-100 rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl text-gray-300 mb-4 overflow-hidden relative group cursor-pointer">
                    <i class="fa-solid fa-camera"></i>
                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest">Ubah Foto</div>
                </div>
                <h3 id="prof_name" class="font-bold text-gray-800 text-lg">Memuat...</h3>
                <p id="prof_email" class="text-xs text-gray-500 mb-4">-</p>
                <span class="px-3 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 text-[10px] font-bold uppercase rounded-md">Unverified</span>
            </div>
            
            <div class="md:col-span-2 space-y-4">
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                    <input type="text" id="inp_name" class="w-full border border-gray-200 rounded-lg py-2 px-3 focus:border-gray-800 outline-none text-sm bg-gray-50 focus:bg-white">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
                        <select id="inp_gender" class="w-full border border-gray-200 rounded-lg py-2 px-3 focus:border-gray-800 outline-none text-sm bg-gray-50">
                            <option value="">Pilih</option><option value="Laki-Laki">Laki-Laki</option><option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Domisili (Kota)</label>
                        <input type="text" id="inp_city" class="w-full border border-gray-200 rounded-lg py-2 px-3 focus:border-gray-800 outline-none text-sm bg-gray-50 focus:bg-white">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bio Singkat</label>
                    <textarea id="inp_bio" rows="4" class="w-full border border-gray-200 rounded-lg py-2 px-3 focus:border-gray-800 outline-none text-sm bg-gray-50 focus:bg-white" placeholder="Ceritakan tentang pengalaman Anda..."></textarea>
                </div>
            </div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    try {
        const res = await apiGet('/functions/api/auth/me'); // Ambil data dasar dulu
        if(res.ok && res.data && res.data.user) {
            document.getElementById('prof_name').textContent = res.data.user.full_name;
            document.getElementById('prof_email').textContent = res.data.user.email;
            document.getElementById('inp_name').value = res.data.user.full_name;
        }
    } catch(e) { console.log(e); }
}
