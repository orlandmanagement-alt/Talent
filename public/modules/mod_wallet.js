import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh] relative">
        <h2 class="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4"><i class="fa-solid fa-wallet text-green-500 mr-2"></i> Dompet Pendapatan</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <i class="fa-solid fa-coins absolute -right-6 -bottom-6 text-8xl text-white/10"></i>
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pendapatan</p>
                <div class="flex items-end gap-2">
                    <h3 class="text-4xl font-black tracking-tight" id="wallet-balance">Memuat...</h3>
                    <span class="text-sm font-bold text-green-400 mb-1">Poin</span>
                </div>
                <p class="text-[11px] text-gray-400 mt-2">1 Poin = Rp 1 (Setara Mata Uang Rupiah)</p>
            </div>
            
            <div class="flex flex-col gap-3">
                <button onclick="window.TalentWallet.openWithdrawModal()" class="flex-1 bg-green-50 text-green-600 border border-green-200 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-green-100 transition-colors group">
                    <i class="fa-solid fa-money-bill-transfer text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                    <span class="text-[12px] font-bold uppercase tracking-wider">Tarik Dana</span>
                </button>
            </div>
        </div>

        <div>
            <h3 class="text-[14px] font-bold text-gray-800 mb-4">Riwayat Transaksi</h3>
            <div id="trx-container" class="space-y-3">
                <div class="py-10 text-center"><i class="fa-solid fa-spinner fa-spin text-2xl text-gray-300"></i></div>
            </div>
        </div>

        <div id="modal-withdraw" class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[60] hidden items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl transform scale-100 transition-all">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-black text-gray-800">Tarik Pendapatan</h3>
                    <button onclick="window.TalentWallet.closeModal()" class="w-8 h-8 bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-blue-50 text-blue-600 p-3 rounded-xl text-[11px] font-bold flex items-start gap-2">
                        <i class="fa-solid fa-circle-info mt-0.5"></i>
                        <p>Minimal penarikan adalah 50.000 Poin. Pastikan data rekening Anda benar.</p>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pilih Bank</label>
                        <select id="wd-bank" class="w-full border border-gray-200 rounded-xl py-3 px-4 outline-none text-[13px] font-bold bg-gray-50 focus:border-gray-800">
                            <option value="">-- Pilih Bank --</option>
                            <option value="BCA">BCA</option><option value="MANDIRI">Mandiri</option><option value="BNI">BNI</option><option value="BRI">BRI</option>
                            <option value="DANA">DANA (E-Wallet)</option><option value="GOPAY">GoPay (E-Wallet)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">No. Rekening / E-Wallet</label>
                        <input type="number" id="wd-account" class="w-full border border-gray-200 rounded-xl py-3 px-4 outline-none text-[13px] font-bold bg-gray-50 focus:border-gray-800" placeholder="Contoh: 08123456789">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Atas Nama</label>
                        <input type="text" id="wd-name" class="w-full border border-gray-200 rounded-xl py-3 px-4 outline-none text-[13px] font-bold bg-gray-50 focus:border-gray-800 uppercase" placeholder="Nama Pemilik Rekening">
                    </div>

                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jumlah Poin yang Ditarik</label>
                        <input type="number" id="wd-amount" class="w-full border border-gray-200 rounded-xl py-3 px-4 outline-none text-[13px] font-bold bg-gray-50 focus:border-gray-800" placeholder="Min. 50000">
                    </div>
                    
                    <div>
                        <label class="block text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1.5"><i class="fa-solid fa-lock"></i> Masukkan 6 Digit PIN Akun</label>
                        <input type="password" id="wd-pin" maxlength="6" class="w-full border border-red-200 rounded-xl py-3 px-4 outline-none text-[16px] font-black tracking-[0.5em] text-center bg-red-50 focus:border-red-500" placeholder="••••••">
                    </div>
                    
                    <button onclick="window.TalentWallet.processWithdraw()" class="w-full bg-gray-900 text-white font-black py-3.5 rounded-xl shadow-lg hover:bg-black mt-2 active:scale-95 transition-transform">Konfirmasi Penarikan</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    let currentBalance = 0;

    window.TalentWallet = {
        fetchData: async () => {
            const container = document.getElementById('trx-container');
            const balEl = document.getElementById('wallet-balance');
            
            try {
                const res = await apiGet('/functions/api/talent/wallet'); // Sesuaikan endpoint
                
                if(res.ok && res.data) {
                    currentBalance = parseInt(res.data.balance || 0);
                    balEl.textContent = currentBalance.toLocaleString('id-ID');
                    
                    const trxs = res.data.transactions || [];
                    if(trxs.length === 0) {
                        container.innerHTML = `
                            <div class="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                                <i class="fa-solid fa-receipt text-4xl text-gray-300 mb-3"></i>
                                <h3 class="text-[13px] font-bold text-gray-700">Belum Ada Transaksi</h3>
                                <p class="text-[11px] text-gray-500 mt-1">Riwayat pendapatan dan penarikan Anda akan muncul di sini.</p>
                            </div>
                        `;
                    } else {
                        // Render riwayat (contoh)
                        container.innerHTML = trxs.map(t => `
                            <div class="p-4 border border-gray-100 rounded-xl flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <h4 class="text-[12px] font-bold text-gray-800">${t.note || 'Transaksi'}</h4>
                                    <p class="text-[10px] text-gray-400 font-bold">${new Date(t.created_at).toLocaleDateString('id-ID')}</p>
                                </div>
                                <span class="text-[13px] font-black ${t.amount > 0 ? 'text-green-500' : 'text-gray-800'}">${t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString('id-ID')} Poin</span>
                            </div>
                        `).join('');
                    }
                } else {
                    throw new Error("No Data");
                }
            } catch(e) {
                balEl.textContent = "0";
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                        <i class="fa-solid fa-receipt text-4xl text-gray-300 mb-3"></i>
                        <h3 class="text-[13px] font-bold text-gray-700">Belum Ada Transaksi</h3>
                        <p class="text-[11px] text-gray-500 mt-1">Dompet Anda masih bersih.</p>
                    </div>
                `;
            }
        },
        openWithdrawModal: () => {
            document.getElementById('wd-amount').value = '';
            document.getElementById('wd-pin').value = '';
            document.getElementById('modal-withdraw').classList.remove('hidden');
            document.getElementById('modal-withdraw').classList.add('flex');
        },
        closeModal: () => {
            document.getElementById('modal-withdraw').classList.add('hidden');
            document.getElementById('modal-withdraw').classList.remove('flex');
        },
        processWithdraw: async () => {
            const bank = document.getElementById('wd-bank').value;
            const acc = document.getElementById('wd-account').value;
            const name = document.getElementById('wd-name').value;
            const amount = parseInt(document.getElementById('wd-amount').value);
            const pin = document.getElementById('wd-pin').value;

            if(!bank || !acc || !name) return alert("Harap lengkapi data rekening Bank/E-Wallet.");
            if(!amount || amount < 50000) return alert("Minimal penarikan adalah 50.000 Poin.");
            if(amount > currentBalance) return alert("Saldo Poin Anda tidak mencukupi.");
            if(!pin || pin.length !== 6) return alert("Harap masukkan 6 digit PIN dengan benar.");

            // Panggil API Withdraw (Contoh simulasi)
            alert("Memproses Penarikan sebesar " + amount.toLocaleString('id-ID') + " Poin ke " + bank + "...");
            // await apiPost('/functions/api/talent/withdraw', { bank, account: acc, account_name: name, amount, pin });
            
            window.TalentWallet.closeModal();
            window.TalentWallet.fetchData(); // Refresh data
        }
    };

    window.TalentWallet.fetchData();
}
