import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-lg mx-auto space-y-8">
        <div class="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <h2 class="text-white text-xl font-black mb-1">Performa Cuan</h2>
            <p class="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] mb-8 text-emerald-400">Statistik Honor 2026</p>
            
            <div id="graph-bars" class="flex items-end justify-between h-40 gap-2 px-2">
                </div>
            
            <div class="flex justify-between mt-4 px-2">
                <span class="text-[8px] font-black text-white/20 uppercase">Jan</span>
                <span class="text-[8px] font-black text-white/20 uppercase">Mar</span>
                <span class="text-[8px] font-black text-white/20 uppercase">Jun</span>
                <span class="text-[8px] font-black text-white/20 uppercase">Sep</span>
                <span class="text-[8px] font-black text-white/20 uppercase">Des</span>
            </div>
        </div>

        <div id="earnings-list" class="space-y-4">
            </div>
    </div>`;
}

export async function initEvents() {
    const graph = document.getElementById('graph-bars');
    const list = document.getElementById('earnings-list');
    
    try {
        const res = await apiGet('/api/talent/earnings_stats');
        if(res.ok && res.stats) {
            const maxVal = Math.max(...res.stats.map(s => s.total), 1000000);
            
            graph.innerHTML = res.stats.map(s => {
                const height = (s.total / maxVal) * 100;
                return `
                <div class="flex-1 bg-emerald-500/20 rounded-t-xl relative group transition-all hover:bg-emerald-400 cursor-pointer" 
                     style="height: ${height}%">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                        Rp${(s.total/1000)}k
                    </div>
                </div>`;
            }).join('');

            list.innerHTML = res.stats.map(s => `
                <div class="bg-white p-5 rounded-3xl border border-slate-50 flex justify-between items-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulan ${s.month}</span>
                    <span class="text-sm font-black text-slate-800">Rp ${s.total.toLocaleString()}</span>
                </div>
            `).join('');
        }
    } catch(e) { console.error(e); }
}
