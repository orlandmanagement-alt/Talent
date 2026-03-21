import { apiGet } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-lg mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Analitik Casting</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pantau perkembangan kariermu</p>
        </div>

        <div class="bg-white p-10 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col items-center gap-8">
            <div class="relative w-48 h-48 flex items-center justify-center">
                <svg class="w-full h-full -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-50"/>
                    <circle id="stat-circle" cx="96" cy="96" r="80" stroke="currentColor" stroke-width="12" fill="transparent" 
                            class="text-blue-600 transition-all duration-1000" stroke-dasharray="502" stroke-dashoffset="502"/>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span id="stat-percent" class="text-4xl font-black text-slate-800">0%</span>
                    <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest">Success Rate</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 w-full">
                <div class="p-5 bg-slate-50 rounded-[2.5rem] text-center">
                    <p id="stat-applied" class="text-xl font-black text-slate-800">0</p>
                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Applied</p>
                </div>
                <div class="p-5 bg-emerald-50 rounded-[2.5rem] text-center border border-emerald-100">
                    <p id="stat-hired" class="text-xl font-black text-emerald-600">0</p>
                    <p class="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Hired</p>
                </div>
            </div>
        </div>
    </div>`;
}

export async function initEvents() {
    try {
        const res = await apiGet('/api/talent/application_stats');
        if(res.ok && res.stats) {
            const applied = res.stats.reduce((acc, curr) => acc + curr.total, 0);
            const hired = res.stats.find(s => s.status === 'hired')?.total || 0;
            const percent = applied > 0 ? Math.round((hired / applied) * 100) : 0;

            document.getElementById('stat-applied').textContent = applied;
            document.getElementById('stat-hired').textContent = hired;
            document.getElementById('stat-percent').textContent = `${percent}%`;

            // Animasi Circle
            const circle = document.getElementById('stat-circle');
            const offset = 502 - (502 * percent) / 100;
            setTimeout(() => circle.setAttribute('stroke-dashoffset', offset), 300);
        }
    } catch(e) { console.error(e); }
}
