import { apiGet } from "/assets/js/api.js";

export async function render() {
  return `
    <div class="max-w-4xl mx-auto space-y-6 fade-in pb-10">
        <h2 class="text-2xl font-black text-gray-800"><i class="fa-solid fa-sack-dollar text-primary mr-2"></i> Dompet Pendapatan</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="md:col-span-1 bg-gradient-to-br from-primary to-orange-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden h-fit">
                <div class="absolute -right-4 -bottom-4 text-white opacity-20 text-8xl"><i class="fa-solid fa-wallet"></i></div>
                <div class="relative z-10">
                    <p class="text-xs font-bold text-orange-100 uppercase tracking-widest mb-2">Total Pendapatan (OP)</p>
                    <h3 class="text-5xl font-black text-white mb-1" id="w_balance"><i class="fa-solid fa-spinner fa-spin text-2xl"></i></h3>
                    <p class="text-[10px] text-orange-100 mb-6">Estimasi: Rp <span id="w_est">0</span></p>
                    
                    <button onclick="window.TalentWallet.withdraw()" class="w-full bg-white text-orange-600 font-black py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg">
                        <i class="fa-solid fa-money-bill-transfer"></i> Cairkan Poin (Withdraw)
                    </button>
                </div>
            </div>

            <div class="md:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3 text-blue-800">
                    <i class="fa-solid fa-circle-info text-xl mt-0.5"></i>
                    <div>
                        <h4 class="font-bold text-sm">Informasi Penarikan</h4>
                        <p class="text-xs mt-1">Poin Orland (OP) didapatkan dari hasil pembayaran Klien atas pekerjaan yang telah Anda selesaikan. Penarikan dana (Withdraw) ke rekening bank asli diproses setiap hari <strong class="font-black">Jumat</strong> dengan minimal penarikan <strong class="font-black">50 OP</strong>.</p>
                    </div>
                </div>

                <h4 class="font-black text-gray-800 mb-4 border-b border-gray-100 pb-3"><i class="fa-solid fa-clock-rotate-left mr-2"></i> Riwayat Transaksi</h4>
                <div id="w_history" class="space-y-3">
                    <div class="text-center py-10"><i class="fa-solid fa-spinner fa-spin text-gray-300 text-3xl"></i></div>
                </div>
            </div>

        </div>
    </div>
  `;
}

export async function initEvents() {
    let currentBalance = 0;

    window.TalentWallet = {
        withdraw: async () => {
            if(currentBalance < 50) return alert("Maaf, minimal penarikan adalah 50 OP (Rp 50.000).");
            
            const { state } = await import("/assets/js/state.js");
            const talentName = state?.user?.full_name || 'Talent';
            
            const message = `Halo Admin Orland!%0A%0ASaya ingin mengajukan Pencairan Poin (Withdraw):%0ANama: ${talentName}%0AJumlah: *${currentBalance} OP*%0A%0AMohon panduannya untuk proses transfer bank. Terima kasih!`;
            const waNumber = "6281234567890"; // GANTI DENGAN NOMOR WA ADMIN
            
            window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
        }
    };

    const res = await apiGet("/functions/api/wallet/info");
    if(res.ok && res.data) {
        currentBalance = res.data.balance || 0;
        document.getElementById("w_balance").textContent = currentBalance;
        document.getElementById("w_est").textContent = (currentBalance * 1000).toLocaleString('id-ID'); // 1 OP = 1000 IDR
        
        const historyContainer = document.getElementById("w_history");
        if(res.data.history.length === 0) {
            historyContainer.innerHTML = `<p class="text-center text-xs text-gray-400 font-bold py-6">Belum ada pendapatan poin masuk.</p>`;
        } else {
            historyContainer.innerHTML = res.data.history.map(h => {
                const isPlus = h.trx_type === 'topup' || h.trx_type === 'earn';
                const sign = isPlus ? '+' : '-';
                const color = isPlus ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50';
                const icon = isPlus ? 'fa-arrow-turn-down' : 'fa-arrow-turn-up';
                const dateStr = new Date(h.created_at * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                
                return `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${color}"><i class="fa-solid ${icon}"></i></div>
                        <div>
                            <p class="text-xs font-bold text-gray-800">${h.note || 'Pendapatan Proyek'}</p>
                            <p class="text-[9px] text-gray-400 font-bold uppercase">${dateStr}</p>
                        </div>
                    </div>
                    <div class="font-black ${isPlus ? 'text-green-600' : 'text-red-600'}">${sign}${h.amount} OP</div>
                </div>
                `;
            }).join("");
        }
    } else {
        document.getElementById("w_balance").textContent = "ERR";
        document.getElementById("w_history").innerHTML = `<p class="text-center text-red-500 font-bold py-6">Gagal memuat dompet.</p>`;
    }
}
