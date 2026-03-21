import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-4xl mx-auto space-y-8">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-2xl font-black text-slate-800 tracking-tight">Media Library</h2>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola Aset Visual Orland</p>
            </div>
            <button onclick="document.getElementById('m-upload').click()" class="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">
                Upload Baru
            </button>
            <input type="file" id="m-upload" class="hidden" multiple onchange="window.handleUpload(this)">
        </div>

        <div id="media-grid" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('media-grid');

    window.handleUpload = async (input) => {
        alert("Proses upload ke R2 dimulai...");
        // Logic upload multipart ke R2 Worker
        window.location.reload();
    };

    window.deleteAsset = async (id, key) => {
        if(!confirm("Hapus permanen aset ini?")) return;
        const res = await apiPost('/api/media/asset_delete', { id, r2_key: key });
        if(res.ok) window.location.reload();
    };

    const res = await apiGet('/api/media/library_get');
    if(res.ok && res.assets) {
        container.innerHTML = res.assets.map(a => `
            <div class="group bg-white rounded-[2rem] border border-slate-100 p-2 shadow-sm relative">
                <div class="aspect-square rounded-2xl bg-cover bg-center mb-2" style="background-image: url('${a.public_url}')"></div>
                <div class="px-2 pb-2">
                    <p class="text-[9px] font-black text-slate-800 truncate uppercase">${a.file_name}</p>
                    <p class="text-[8px] text-slate-400 font-bold">${(a.file_size / 1024).toFixed(1)} KB</p>
                </div>
                <button onclick="window.deleteAsset('${a.id}', '${a.r2_key}')" 
                        class="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur text-red-500 rounded-xl opacity-0 group-hover:opacity-100 shadow-sm transition-all">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    }
}
