import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-sm mx-auto space-y-8">
        <div class="text-center">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Tarik Saldo</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cairkan hasil kerja kerasmu</p>
        </div>

        <div class="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
            <p class="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-1">Saldo Tersedia</p>
            <h3 id="p-balance" class="text-3xl font-black italic">Rp 0</h3>
            <div class="absolute -right-4 -bottom-4 text-7xl opacity-10 rotate-12"><i class="fa-solid fa-money-bill-transfer"></i></div>
        </div>

        <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-5">
            <div>
                <label class="text-[9px] font-black text-slate-400 uppercase px-2">Metode Pencairan</label>
                <select id="p-method" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 ring-blue-500/10 mt-2">
                    <option value="dana">DANA</option>
                    <option value="ovo">OVO</option>
                    <option value="bank_transfer">Transfer Bank (BCA/Mandiri)</option>
                </select>
            </div>
            
            <div>
                <label class="text-[9px] font-black text-slate-400 uppercase px-2">Nominal (Min 50rb)</label>
                <input type="number" id="p-amount" placeholder="Rp 0" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-black outline-none focus:ring-4 ring-blue-500/10 mt-2">
            </div>

            <div>
                <label class="text-[9px] font-black text-slate-400 uppercase px-2">Detail Rekening / No. HP</label>
                <textarea id="p-account" placeholder="Contoh: BCA 12345678 a/n Widya Orland" class="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 ring-blue-500/10 mt-2"></textarea>
            </div>

            <button onclick="window.requestPayout()" class="w-full bg-blue-600 text-white py-5 rounded-[2.5rem] font-black text-[10px] uppercase shadow-xl active:scale-95 transition-all">
                Ajukan Pencairan
            </button>
        </div>
    </div>`;
}

export async function initEvents() {
    // Ambil saldo real-time
    const res = await apiGet('/api/wallet/balance');
    if(res.ok) document.getElementById('p-balance').textContent = `Rp ${res.balance.toLocaleString()}`;

    window.requestPayout = async () => {
        const payload = {
            method: document.getElementById('p-method').value,
            amount: parseInt(document.getElementById('p-amount').value),
            account: document.getElementById('p-account').value
        };

        if(!payload.amount || !payload.account) return alert("Lengkapi data pencairan!");

        const postRes = await apiPost('/api/talent/payout_request', payload);
        if(postRes.ok) {
            alert(postRes.message);
            location.reload();
        }
    };
}
