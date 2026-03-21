import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-sm mx-auto space-y-8 text-center">
        <div class="mb-4">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Kartu Digital</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scan untuk akses portofolio</p>
        </div>

        <div class="bg-white p-10 rounded-[4rem] shadow-2xl shadow-slate-200 border border-slate-50 flex flex-col items-center gap-6 relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            
            <div id="qrcode" class="relative z-10 p-4 bg-white rounded-3xl border-4 border-slate-900 shadow-sm">
                <div id="qr-loading" class="w-48 h-48 flex items-center justify-center">
                    <i class="fa-solid fa-qrcode fa-spin text-4xl text-slate-100"></i>
                </div>
            </div>

            <div class="z-10">
                <h3 id="qr-name" class="text-lg font-black text-slate-800 italic">Memuat nama...</h3>
                <p id="qr-id" class="text-[9px] font-black text-blue-500 uppercase tracking-widest">ID: ORLAND-XXXX</p>
            </div>
        </div>

        <button onclick="window.printQR()" class="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">
            <i class="fa-solid fa-download mr-2"></i> Simpan Kartu QR
        </button>
        
        <p class="text-[9px] text-slate-300 font-bold px-8">Tunjukkan kode ini saat casting offline agar data kamu langsung tersimpan di sistem Client.</p>
    </div>`;
}

export async function initEvents() {
    const qrName = document.getElementById('qr-name');
    const qrId = document.getElementById('qr-id');
    const qrBox = document.getElementById('qrcode');

    try {
        const res = await apiGet('/api/talent/me'); // Ambil data profil sendiri
        if(res.ok && res.data) {
            qrName.textContent = res.data.full_name;
            qrId.textContent = `ID: ORLAND-${res.data.id.split('-')[1]}`;
            
            // Generate QR menggunakan API Google Chart (Simpel & Cepat)
            const profileUrl = `${window.location.origin}/#talent?id=${res.data.user_id}`;
            const qrImageUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(profileUrl)}&chs=300x300&choe=UTF-8&chld=L|2`;
            
            qrBox.innerHTML = `<img src="${qrImageUrl}" class="w-48 h-48 rounded-lg" alt="QR Code">`;
        }
    } catch(e) { console.error(e); }

    window.printQR = () => {
        window.print(); // Solusi sederhana untuk simpan kartu
    };
}
