export async function render() {
    return `
    <div class="bg-gray-50 rounded-2xl border border-gray-200 min-h-[85vh] flex flex-col relative z-30">
        
        <div class="bg-white p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 rounded-t-2xl">
            <h2 class="text-lg font-black text-gray-800"><i class="fa-solid fa-address-card text-blue-500 mr-2"></i> Comp Card Maker</h2>
            <div class="flex gap-2">
                <button onclick="window.Comcard.exportPDF()" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-[12px] font-bold shadow hover:bg-black"><i class="fa-solid fa-download mr-1"></i> Simpan PDF</button>
            </div>
        </div>

        <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
            
            <div class="w-full lg:w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto z-20">
                
                <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Pilih Layout (1-25)</h3>
                <div class="grid grid-cols-5 gap-2 mb-6" id="layout-options">
                    </div>

                <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Pilih Tema Warna</h3>
                <div class="flex flex-wrap gap-2 mb-6">
                    <button class="w-8 h-8 rounded-full border-2 border-gray-300 bg-white" onclick="window.Comcard.setTheme('bg-white text-gray-900')"></button>
                    <button class="w-8 h-8 rounded-full border-2 border-transparent bg-gray-900" onclick="window.Comcard.setTheme('bg-gray-900 text-white')"></button>
                    <button class="w-8 h-8 rounded-full border-2 border-transparent bg-slate-800" onclick="window.Comcard.setTheme('bg-slate-800 text-slate-100')"></button>
                    <button class="w-8 h-8 rounded-full border-2 border-transparent bg-red-900" onclick="window.Comcard.setTheme('bg-red-900 text-white')"></button>
                    <button class="w-8 h-8 rounded-full border-2 border-transparent bg-blue-900" onclick="window.Comcard.setTheme('bg-blue-900 text-white')"></button>
                    <button class="w-8 h-8 rounded-full border-2 border-transparent bg-yellow-50" onclick="window.Comcard.setTheme('bg-yellow-50 text-gray-900')"></button>
                </div>

                <h3 class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Data Profil</h3>
                <div class="space-y-3">
                    <input type="text" id="cc_name" class="w-full border border-gray-200 rounded p-2 text-xs font-bold" value="NAMA TALENT" oninput="window.Comcard.updateText()">
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" id="cc_height" class="w-full border border-gray-200 rounded p-2 text-xs" value="Height: 175cm" oninput="window.Comcard.updateText()">
                        <input type="text" id="cc_weight" class="w-full border border-gray-200 rounded p-2 text-xs" value="Weight: 60kg" oninput="window.Comcard.updateText()">
                        <input type="text" id="cc_shoes" class="w-full border border-gray-200 rounded p-2 text-xs" value="Shoes: 42" oninput="window.Comcard.updateText()">
                        <input type="text" id="cc_hair" class="w-full border border-gray-200 rounded p-2 text-xs" value="Hair: Black" oninput="window.Comcard.updateText()">
                    </div>
                </div>
            </div>

            <div class="flex-1 bg-gray-100 p-8 flex justify-center items-start overflow-y-auto relative z-10">
                
                <div id="comcard-paper" class="w-[210mm] h-[297mm] bg-white shadow-xl flex flex-col transition-all overflow-hidden relative">
                    <div id="cc-photo-grid" class="flex-1 w-full grid gap-1 p-1">
                        </div>

                    <div id="cc-footer" class="h-[40mm] w-full p-6 flex flex-col justify-center items-center text-center border-t border-gray-200 bg-inherit">
                        <h1 id="disp_name" class="text-4xl font-black uppercase tracking-[0.2em] mb-3">NAMA TALENT</h1>
                        <div id="disp_stats" class="text-sm font-bold tracking-widest flex gap-4 flex-wrap justify-center opacity-80">
                            <span>Height: 175cm</span> • <span>Weight: 60kg</span> • <span>Shoes: 42</span> • <span>Hair: Black</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    `;
}

export async function initEvents() {
    // Definisi 25 Layout Grid CSS Tailwind yang berbeda
    const gridLayouts = [
        "grid-cols-1 grid-rows-1", // 1
        "grid-cols-2 grid-rows-1", // 2
        "grid-cols-1 grid-rows-2", // 3
        "grid-cols-2 grid-rows-2", // 4
        "grid-cols-3 grid-rows-1", // 5
        "grid-cols-1 grid-rows-3", // 6
        "grid-cols-3 grid-rows-2", // 7
        "grid-cols-2 grid-rows-3", // 8
        "grid-cols-3 grid-rows-3", // 9 (9 photos)
        // Pola Asimetris (menggunakan class kustom nanti saat render)
        "layout-custom-10", "layout-custom-11", "layout-custom-12", "layout-custom-13", "layout-custom-14",
        "layout-custom-15", "layout-custom-16", "layout-custom-17", "layout-custom-18", "layout-custom-19",
        "layout-custom-20", "layout-custom-21", "layout-custom-22", "layout-custom-23", "layout-custom-24", "layout-custom-25"
    ];

    window.Comcard = {
        renderLayoutButtons: () => {
            const container = document.getElementById('layout-options');
            container.innerHTML = gridLayouts.map((l, idx) => `
                <button onclick="window.Comcard.applyLayout(${idx + 1})" class="aspect-square bg-gray-100 border-2 border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center text-[10px] font-black text-gray-400 transition-colors">
                    ${idx + 1}
                </button>
            `).join('');
        },

        applyLayout: (layoutId) => {
            const grid = document.getElementById('cc-photo-grid');
            grid.className = "flex-1 w-full grid gap-1 p-1 " + (gridLayouts[layoutId - 1] || "grid-cols-2 grid-rows-2");
            
            // Tentukan jumlah slot berdasarkan layout. Simulasi:
            let slotCount = 4; // Default
            if(layoutId === 1) slotCount = 1;
            else if(layoutId === 2 || layoutId === 3) slotCount = 2;
            else if(layoutId === 4) slotCount = 4;
            else if(layoutId === 5 || layoutId === 6) slotCount = 3;
            else if(layoutId === 7 || layoutId === 8) slotCount = 6;
            else if(layoutId === 9) slotCount = 9;
            else slotCount = 5; // Asimetris biasanya 1 besar, 4 kecil

            // Render Slots
            let slotsHTML = "";
            for(let i = 0; i < slotCount; i++) {
                // Pola asimetris (Layout 10) misalnya: Slot pertama rentang 2 kolom/baris
                let extraClass = "";
                if (layoutId >= 10 && i === 0) extraClass = "col-span-2 row-span-2";
                
                slotsHTML += `
                <div class="relative bg-gray-200 overflow-hidden flex items-center justify-center group ${extraClass}">
                    <i class="fa-solid fa-image text-3xl text-gray-400 group-hover:hidden"></i>
                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer">
                        <span class="text-white text-[10px] font-bold uppercase tracking-widest"><i class="fa-solid fa-upload"></i> Upload</span>
                    </div>
                </div>`;
            }
            grid.innerHTML = slotsHTML;
        },

        setTheme: (themeClasses) => {
            const paper = document.getElementById('comcard-paper');
            // Hapus kelas warna sebelumnya
            paper.className = paper.className.replace(/bg-\w+-\d+|bg-white|text-\w+-\d+|text-gray-900/g, '');
            // Tambahkan yang baru
            paper.className += ` ${themeClasses}`;
        },

        updateText: () => {
            document.getElementById('disp_name').textContent = document.getElementById('cc_name').value;
            document.getElementById('disp_stats').innerHTML = `
                <span>${document.getElementById('cc_height').value}</span> • 
                <span>${document.getElementById('cc_weight').value}</span> • 
                <span>${document.getElementById('cc_shoes').value}</span> • 
                <span>${document.getElementById('cc_hair').value}</span>
            `;
        },

        exportPDF: () => {
            alert("Mengekspor Comp Card ke PDF... (Fungsi ini membutuhkan integrasi html2canvas/jspdf di backend/frontend akhir)");
        }
    };

    window.Comcard.renderLayoutButtons();
    window.Comcard.applyLayout(4); // Default ke layout 4 (2x2)
}
