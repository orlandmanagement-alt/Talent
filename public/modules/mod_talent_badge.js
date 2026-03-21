import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-lg mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Koleksi Lencana</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Tanda Profesionalisme Orland</p>
        </div>

        <div id="badge-container" class="grid grid-cols-2 gap-4">
            </div>

        <div class="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100">
            <h4 class="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Cara Mendapatkan</h4>
            <p class="text-[10px] text-blue-800/60 leading-relaxed font-bold">Teruslah melamar casting dan berikan performa terbaik. Rating bintang 5 dari PH akan membuka lencana-lencana eksklusif lainnya!</p>
        </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('badge-container');
    
    try {
        const res = await apiGet('/api/talent/my_badges');
        if(res.ok && res.badges.length > 0) {
            container.innerHTML = res.badges.map(b => `
                <div class="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center gap-3 text-center transition-all hover:scale-105">
                    <div class="w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-inner" 
                         style="background-color: ${b.color_hex}20; color: ${b.color_hex}">
                        <i class="fa-solid ${b.icon_code}"></i>
                    </div>
                    <span class="text-[10px] font-black text-slate-800 uppercase tracking-tighter">${b.label}</span>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="col-span-2 text-center py-10 text-slate-200 font-black italic">Belum ada lencana yang terbuka...</div>';
        }
    } catch(e) { console.error(e); }
}
