import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
    return `
    <div class="p-6 max-w-2xl mx-auto space-y-6">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">Notifikasi</h2>
            <button onclick="window.markAllRead()" class="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                Tandai Dibaca
            </button>
        </div>

        <div id="notif-list" class="space-y-3">
            </div>
    </div>`;
}

export async function initEvents() {
    const container = document.getElementById('notif-list');
    
    const icons = {
        job_alert: { icon: 'fa-briefcase', bg: 'bg-emerald-500' },
        payment: { icon: 'fa-wallet', bg: 'bg-amber-500' },
        system: { icon: 'fa-shield-halved', bg: 'bg-slate-900' },
        chat: { icon: 'fa-comment-dots', bg: 'bg-blue-500' }
    };

    try {
        const res = await apiGet('/api/notifications_get');
        if(res.ok && res.notifications.length > 0) {
            container.innerHTML = res.notifications.map(n => `
                <div onclick="location.href='${n.link_url || '#'}'" 
                     class="group bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-4 transition-all hover:bg-slate-50 cursor-pointer ${n.is_read ? 'opacity-60' : 'border-l-4 border-l-blue-500'}">
                    <div class="w-10 h-10 rounded-2xl ${icons[n.type]?.bg || 'bg-slate-400'} text-white flex items-center justify-center shrink-0 shadow-lg">
                        <i class="fa-solid ${icons[n.type]?.icon || 'fa-bell'} text-xs"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="text-xs font-black text-slate-800 mb-1">${n.title}</h4>
                        <p class="text-[11px] text-slate-500 font-bold leading-tight mb-2">${n.message}</p>
                        <p class="text-[8px] text-slate-300 font-black uppercase tracking-widest italic">
                            ${new Date(n.created_at * 1000).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="text-center py-20 text-slate-200 font-black italic">Sunyi sekali di sini...</div>';
        }
    } catch(e) { console.error(e); }
}
