export async function loadModule(moduleName, menuElement = null) {
    const contentArea = document.getElementById('main-content');
    if(!contentArea) return;

    // Spinner Biru agar terlihat beda dengan background
    contentArea.innerHTML = '<div class="flex items-center justify-center h-full min-h-[50vh]"><i class="fa-solid fa-circle-notch fa-spin text-4xl text-blue-500"></i></div>';

    try {
        // PERBAIKAN: Gunakan "/" di depan agar selalu mencari dari root public
        const module = await import(`/modules/mod_${moduleName}.js?t=${Date.now()}`);
        
        contentArea.innerHTML = await module.render();
        
        if (module.initEvents) {
            await module.initEvents();
        }

        if(menuElement) {
            document.querySelectorAll('aside a').forEach(el => {
                el.classList.remove('bg-gray-100', 'text-gray-900', 'font-black');
            });
            menuElement.classList.add('bg-gray-100', 'text-gray-900', 'font-black');
        }

        // Tutup sidebar otomatis di mobile setelah klik menu
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth < 1024 && sidebar) {
            sidebar.classList.add('-translate-x-full');
        }

    } catch (error) {
        console.error(`Gagal memuat modul ${moduleName}:`, error);
        contentArea.innerHTML = `<div class="p-8 text-center text-red-500 font-bold border-2 border-dashed border-red-200 rounded-2xl bg-red-50 m-4"><i class="fa-solid fa-triangle-exclamation text-4xl mb-3"></i><br>Gagal memuat modul "${moduleName}".</div>`;
    }
}
window.loadModule = loadModule;
