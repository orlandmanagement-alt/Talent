export async function render() {
  return `
    <style>
    /* CORE VARIABLES & CSS COMPILER */
    #comcard-module { --bg-gradient:linear-gradient(135deg,#ffffff 0%,#f3f4f6 100%);--text-footer:#000000;--footer-bg:rgba(255,255,255,0.85);--accent-line:linear-gradient(90deg,#fbbf24 0%,#d97706 100%);--bg-highlight:rgba(255,255,255,0.5);--line-subtle:rgba(0,0,0,0.03);--line-medium:rgba(0,0,0,0.06);--line-strong:rgba(0,0,0,0.1);--line-dark:rgba(0,0,0,0.05); }
    #comcard-module .main-layout{display:flex;width:100%;min-height:80vh; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; background: #f3f4f6;}
    #comcard-module .editor-sidebar{width:380px;background:#fff;box-shadow:2px 0 20px rgba(0,0,0,0.05);display:flex;flex-direction:column;z-index:50;flex-shrink:0;padding:20px;height:80vh;overflow-y:auto;}
    #comcard-module .preview-wrapper{flex:1;background:#27272a;display:flex;justify-content:center;align-items:flex-start;padding:40px;position:relative;overflow-y:auto; overflow-x:hidden;}
    @media(max-width:1024px){#comcard-module .main-layout{flex-direction:column;height:auto} #comcard-module .editor-sidebar{width:100%;height:auto;position:relative;order:1;padding-bottom:20px;box-shadow:0 4px 15px rgba(0,0,0,0.1)} #comcard-module .preview-wrapper{width:100%;order:2;padding:20px 10px;min-height:auto;align-items:flex-start; overflow-x: auto;}}
    #comcard-module #scale-container{transform-origin:top center;transition:transform .3s cubic-bezier(.25,.46,.45,.94);box-shadow:0 20px 50px rgba(0,0,0,0.6);background:#fff;flex-shrink:0;}
    #comcard-module .comp-card-paper{width:794px;height:1123px;background:var(--bg-gradient);display:flex;flex-direction:column;padding:40px;box-sizing:border-box;position:relative;overflow:hidden;transition:background .5s ease;color:var(--text-footer)}
    #comcard-module .pattern-layer{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
    #comcard-module .pat-diagonal{background:repeating-linear-gradient(115deg,transparent 0,transparent 20px,var(--line-medium) 40px,var(--line-strong) 60px,var(--line-medium) 80px,transparent 100px)}
    #comcard-module .pat-sunburst{background:repeating-conic-gradient(from 0deg at 50% 30%,transparent 0deg,transparent 10deg,var(--line-subtle) 10deg,var(--line-medium) 20deg)}
    #comcard-module .pat-waves{background:radial-gradient(100% 100% at 50% 0%,transparent 50%,var(--line-medium) 53%,transparent 56%),radial-gradient(100% 100% at 50% 100%,transparent 50%,var(--line-medium) 53%,transparent 56%);background-size:100% 100%,100% 100%}
    #comcard-module .pat-hex{background-image:radial-gradient(circle,var(--line-medium) 2px,transparent 2.5px),radial-gradient(circle,var(--line-medium) 2px,transparent 2.5px);background-size:40px 40px;background-position:0 0,20px 20px}
    #comcard-module .pat-polka{background-image:radial-gradient(var(--line-medium) 20%,transparent 20%);background-size:30px 30px}
    #comcard-module .pat-grid{background-image:linear-gradient(var(--line-medium) 1px,transparent 1px),linear-gradient(90deg,var(--line-medium) 1px,transparent 1px);background-size:30px 30px}
    #comcard-module .pat-vertical{background:repeating-linear-gradient(90deg,transparent,transparent 20px,var(--line-subtle) 20px,var(--line-subtle) 40px)}
    #comcard-module .pat-horizontal{background:repeating-linear-gradient(0deg,transparent,transparent 20px,var(--line-subtle) 20px,var(--line-subtle) 40px)}
    #comcard-module .color-section-label{font-size:10px;font-weight:700;color:#6b7280;margin:10px 0 4px 0;text-transform:uppercase;letter-spacing:.5px}
    #comcard-module .color-grid{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:5px}
    #comcard-module .color-btn{width:30px;height:30px;border-radius:50%;border:2px solid #e5e7eb;cursor:pointer;position:relative;transition:all .2s;flex-shrink:0}
    #comcard-module .color-btn:hover{transform:scale(1.1);z-index:10;border-color:#fbbf24}
    #comcard-module .color-btn.active{border-color:#111827;transform:scale(1.1);box-shadow:0 0 0 2px rgba(251,191,36,.5)}
    #comcard-module .c-white{background:linear-gradient(135deg,#fff,#f3f4f6)} #comcard-module .c-red-l{background:linear-gradient(135deg,#fee2e2,#fca5a5)} #comcard-module .c-gray-d{background:linear-gradient(135deg,#4b5563,#1f2937)}
    #comcard-module .custom-select-trigger,#comcard-module .dropdown-trigger{display:flex;justify-content:space-between;align-items:center;padding:10px;background:#fff;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-weight:700;font-size:13px;transition:.2s}
    #comcard-module .custom-options,#comcard-module .dropdown-content{position:absolute;top:110%;left:0;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 10px 25px rgba(0,0,0,0.15);padding:8px;display:none;max-height:400px;overflow-y:auto;z-index:100}
    #comcard-module .custom-options.open,#comcard-module .dropdown-content.open{display:grid}
    #comcard-module .pattern-item{aspect-ratio:1/1;width:100%;min-height:40px;border-radius:8px;border:2px solid #e5e7eb;cursor:pointer;position:relative;overflow:hidden;transition:transform .2s}
    #comcard-module .pattern-preview{--bg-primary:#3b82f6;--line-subtle:rgba(255,255,255,0.1);--line-medium:rgba(255,255,255,0.25);--line-strong:rgba(255,255,255,0.5);background-color:var(--bg-primary);}
    #comcard-module .pattern-item.active{border-color:#2563eb;box-shadow:0 0 0 2px #93c5fd}
    #comcard-module .photo-area{flex:1;display:grid;gap:10px;overflow:hidden;margin-bottom:20px;z-index:10;position:relative;padding:8px;background:rgba(255,255,255,.3);border-radius:4px;backdrop-filter:blur(3px)}
    #comcard-module .img-slot{background:rgba(0,0,0,0.05);position:relative;overflow:hidden;width:100%;height:100%;border:1px solid rgba(0,0,0,0.1)}
    #comcard-module .img-slot img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;max-width:none!important}
    #comcard-module .control-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:.2s;cursor:pointer;z-index:20}
    #comcard-module .img-slot:hover .control-overlay{opacity:1}
    #comcard-module .card-footer{flex-shrink:0;min-height:180px;display:flex;justify-content:space-between;align-items:flex-end;padding:30px 20px 20px 20px;position:relative;z-index:10;margin:-10px -20px -20px -20px;background:linear-gradient(to top,var(--footer-bg) 0,rgba(255,255,255,0) 100%);color:var(--text-footer)}
    #comcard-module .info-left{text-align:left;width:65%;color:inherit} #comcard-module .model-name{font-size:38px;font-weight:800;text-transform:capitalize;margin-bottom:0;line-height:1.8}
    #comcard-module .name-underline{width:100%;height:6px;background:var(--accent-line);margin-top:8px;margin-bottom:15px;border-radius:4px;}
    #comcard-module .specs-container{display:grid;grid-template-columns:1fr 1fr;gap:40px;font-family:'Open Sans',sans-serif;font-size:18px;background:transparent}
    #comcard-module .spec-col{display:grid;grid-template-columns:70px 10px auto;gap:0 10px;align-items:center}
    #comcard-module .logo-right{width:32%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;color:inherit}
    #comcard-module .logo-right svg{display:block;fill:currentColor;} #comcard-module .comcard-label{font-weight:800;font-size:24px;letter-spacing:2px;margin-top:5px;text-align:center;color:inherit}
    /* Layouts Subset for brevity, will inject dynamic layouts */
    #comcard-module .layout-1{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr} #comcard-module .layout-2{grid-template-columns:1fr 1fr;grid-template-rows:1.5fr 1fr} #comcard-module .layout-2 .slot-1{grid-column:span 2}
    #comcard-module .layout-12{grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:1.5fr 1fr} #comcard-module .layout-12 .slot-1{grid-column:span 2} #comcard-module .layout-12 .slot-2{grid-column:span 2}
    #comcard-module .layout-19{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr} #comcard-module .layout-25{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:0} #comcard-module .layout-25 .img-slot{border:2px solid #fff}
    #comcard-module .option-item{display:flex;align-items:center;gap:10px;padding:6px;border:1px solid #f3f4f6;border-radius:6px;cursor:pointer} #comcard-module .option-item:hover{background-color:#fffbeb;border-color:#fbbf24}
    #comcard-module .icon-box{width:35px;height:50px;background:#f3f4f6;border:1px solid #d1d5db;display:grid;gap:1px;padding:1px;} #comcard-module .icon-box div{background:#9ca3af;width:100%;height:100%}
    #comcard-module .custom-input{width:100%;border:1px solid #d1d5db;padding:8px;border-radius:6px;font-size:13px;font-weight:600;box-sizing:border-box; margin-bottom:6px;}
    #comcard-module .btn-black{width:100%;background:#111827;color:#fff;padding:12px;border-radius:8px;font-weight:700;cursor:pointer;border:none; margin-bottom:8px;}
    #comcard-module .crop-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:none;align-items:center;justify-content:center}
    #comcard-module .cropper-wrapper{height:400px;background:#333;overflow:hidden}
    </style>

    <div id="comcard-module">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800"><i class="fa-solid fa-object-group text-primary mr-2"></i> Custom Comcard Maker</h2>
            <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black shadow-sm border border-yellow-200"><i class="fa-solid fa-floppy-disk"></i> Auto-Save Local Storage</span>
        </div>

        <div class="main-layout">
            <div class="editor-sidebar">
                <div style="margin-bottom:15px;">
                    <label style="display:block;font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;margin-bottom:6px">Tema Background</label>
                    <div class="color-section-label">Light Soft (Pastel)</div>
                    <div class="color-grid">
                        <div class="color-btn c-white active" data-theme="light" data-color="white"></div>
                        <div class="color-btn c-red-l" data-theme="light" data-color="red"></div>
                        <div class="color-btn c-gray-d" data-theme="dark" data-color="gray"></div>
                    </div>
                </div>

                <div style="margin-bottom:15px; position:relative; z-index:50;">
                    <label style="display:block;font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;margin-bottom:6px">Pilih Layout</label>
                    <div class="custom-select-trigger" id="layout-trigger" style="border:2px solid #fbbf24">
                        <span id="selected-layout-text">1. Classic Grid 4</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="custom-options" id="layout-options" style="grid-template-columns:1fr;"></div>
                </div>

                <div style="margin-bottom:15px;">
                    <label style="display:block;font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;margin-bottom:6px">Pilih Motif</label>
                    <button class="dropdown-trigger" id="pattern-trigger" style="width:100%">
                        <span class="text-sm font-medium text-gray-700"><i class="fas fa-th mr-2 text-gray-400"></i> Pilih Motif</span>
                        <i class="fas fa-chevron-down text-gray-400"></i>
                    </button>
                    <div id="patternDropdown" class="dropdown-content">
                        <div id="patternGrid" class="grid grid-cols-4 gap-2"></div>
                    </div>
                </div>

                <div style="margin-bottom:15px;">
                    <label style="display:block;font-size:11px;font-weight:800;color:#9ca3af;text-transform:uppercase;margin-bottom:6px">Biodata</label>
                    <input type="text" id="in-name" class="custom-input" placeholder="Nama Lengkap">
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" id="in-age" class="custom-input" placeholder="Usia (th)">
                        <input type="text" id="in-height" class="custom-input" placeholder="Tinggi (cm)">
                        <input type="text" id="in-weight" class="custom-input" placeholder="Berat (kg)">
                        <select id="in-shirt" class="custom-input">
                            <option value="">- Size Baju -</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option>
                        </select>
                        <input type="text" id="in-shoe" class="custom-input" placeholder="Sepatu">
                        <input type="text" id="in-eyes" class="custom-input" placeholder="Warna Mata">
                    </div>
                </div>

                <div class="mt-auto pt-4 border-t border-gray-200">
                    <button id="btn-dl-jpg" class="btn-black"><i class="fas fa-download"></i> DOWNLOAD JPG (HD)</button>
                    <div class="flex gap-2">
                        <button id="btn-dl-png" class="flex-1 bg-gray-600 text-white py-2 rounded-lg font-bold text-xs">PNG</button>
                        <button id="btn-dl-pdf" class="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold text-xs">PDF</button>
                        <button id="btn-reset" class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold text-xs hover:bg-red-100 hover:text-red-600">RESET</button>
                    </div>
                </div>
            </div>

            <div class="preview-wrapper" id="preview-wrapper">
                <div id="scale-container">
                    <div id="comp-card" class="comp-card-paper">
                        <div id="active-pattern-layer" class="pattern-layer pat-diagonal"></div>
                        <div id="grid-container" class="photo-area layout-1"></div>
                        <div class="card-footer">
                            <div class="info-left">
                                <h1 class="model-name" id="out-name">Nama Kamu</h1>
                                <div class="name-underline"></div>
                                <div class="specs-container">
                                    <div class="spec-col">
                                        <div class="specs-label">Usia</div><div class="specs-sep">:</div><div class="specs-val" id="out-age">-</div>
                                        <div class="specs-label">Tinggi</div><div class="specs-sep">:</div><div class="specs-val" id="out-height">-</div>
                                        <div class="specs-label">Berat</div><div class="specs-sep">:</div><div class="specs-val" id="out-weight">-</div>
                                    </div>
                                    <div class="spec-col">
                                        <div class="specs-label">Baju</div><div class="specs-sep">:</div><div class="specs-val" id="out-shirt">-</div>
                                        <div class="specs-label">Sepatu</div><div class="specs-sep">:</div><div class="specs-val" id="out-shoe">-</div>
                                        <div class="specs-label">Mata</div><div class="specs-sep">:</div><div class="specs-val" id="out-eyes">-</div>
                                    </div>
                                </div>
                            </div>
                            <div class="logo-right">
                                <svg id="default-logo-svg" version="1.0" xmlns="http://www.w3.org/2000/svg" width="150pt" height="75pt" viewBox="0 0 600 299" preserveAspectRatio="xMidYMid meet">
                                    <g transform="translate(0.000000,299.000000) scale(0.100000,-0.100000)" stroke="none">
                                        <path d="M4841 2831 c3 -31 12 -67 20 -79 17 -28 78 -52 130 -52 24 0 38 -4 34 -10 -3 -5 -26 -10 -51 -10 -85 0 -134 -49 -134 -135 0 -19 -4 -35 -10 -35 -5 0 -10 18 -10 40 0 49 -22 95 -53 112 -26 14 -137 27 -137 16 0 -12 46 -28 78 -28 43 0 69 -25 86 -84 27 -92 54 -93 71 -4 10 51 36 75 99 88 70 14 89 35 57 61 -13 11 -34 19 -48 19 -14 0 -40 7 -59 16 -28 14 -36 25 -50 75 -22 78 -32 82 -23 10z"/>
                                    </g>
                                </svg>
                                <div class="comcard-label">COMCARD</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="crop-modal" class="crop-modal-overlay">
            <div class="bg-white p-5 rounded-xl w-[90%] max-w-lg shadow-2xl relative z-10">
                <h3 class="text-lg font-bold mb-4">Posisikan Foto</h3>
                <div class="cropper-wrapper rounded-lg mb-4"><img id="image-to-crop" src="" style="max-width:100%;"></div>
                <div class="flex justify-end gap-2">
                    <button id="btn-cancel-crop" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold">Batal</button>
                    <button id="btn-save-crop" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow">Terapkan</button>
                </div>
            </div>
        </div>
        <input type="file" id="file-input" class="hidden" accept="image/*">
    </div>
  `;
}

export async function initEvents() {
    // 1. DYNAMICALLY LOAD HEAVY LIBRARIES SO IT DOESN'T SLOW DOWN THE APP
    const loadScript = (src) => new Promise(r => { if(document.querySelector(`script[src="${src}"]`)) return r(); const s = document.createElement("script"); s.src = src; s.onload = r; document.head.appendChild(s); });
    const loadStyle = (href) => { if(!document.querySelector(`link[href="${href}"]`)){ const l = document.createElement("link"); l.rel="stylesheet"; l.href=href; document.head.appendChild(l); } };
    
    // Tampilkan notifikasi loading...
    import("/assets/js/notify.js").then(m => m.notify("Memuat Engine Generator...", "info"));
    
    await loadStyle("https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css");
    await Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js")
    ]);

    // 2. STATE & VARIABLES
    let currentTemplate = 1, activeSlotIndex = null, cropper = null;
    const placeholderImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%239ca3af' dominant-baseline='middle' text-anchor='middle' font-weight='bold'%3E+%3C/text%3E%3C/svg%3E";
    let images = new Array(15).fill(placeholderImg);

    // 3. LOCAL STORAGE AUTOSAVE SYSTEM
    const saveState = () => {
        const data = {
            images: images.filter(i => i !== placeholderImg), // Hanya simpan gambar asli agar quota storage tidak penuh cepat
            template: currentTemplate,
            themeColor: document.querySelector('.color-btn.active')?.dataset.color || 'white',
            themeMode: document.querySelector('.color-btn.active')?.dataset.theme || 'light',
            pattern: document.getElementById('active-pattern-layer').className.split(' ').find(c => c.startsWith('pat-')) || 'pat-diagonal',
            inputs: ['name','age','height','weight','shirt','shoe','eyes'].reduce((acc, id) => ({...acc, [id]: document.getElementById(`in-${id}`).value}), {})
        };
        localStorage.setItem('orland_comcard_draft', JSON.stringify(data));
    };

    // 4. DATA INITIALIZATION
    const patterns = [{id:'pat-diagonal',name:'Diagonal'},{id:'pat-sunburst',name:'Sunburst'},{id:'pat-polka',name:'Polka'},{id:'pat-grid',name:'Grid'},{id:'pat-vertical',name:'V-Stripes'},{id:'pat-horizontal',name:'H-Stripes'}];
    const layouts = [{id:1,name:"Classic Grid 4",count:4},{id:2,name:"Hero Top 3",count:3},{id:12,name:"Balance Mix Top 6",count:6},{id:19,name:"Grid Six 6",count:6},{id:25,name:"Checkerboard 4",count:4}];
    const gradients = {
        light: { white:'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)', red:'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)' },
        dark: { gray:'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)' }
    };

    // Render Patterns
    const patGrid = document.getElementById("patternGrid");
    patterns.forEach(p => {
        const d = document.createElement("div"); d.className = `pattern-item pattern-preview ${p.id}`;
        d.onclick = () => { document.getElementById('active-pattern-layer').className = `pattern-layer ${p.id}`; document.getElementById('patternDropdown').classList.remove('open'); saveState(); };
        patGrid.appendChild(d);
    });

    // Render Layouts
    const layDropdown = document.getElementById("layout-options");
    layDropdown.innerHTML = layouts.map(l => `<div class="option-item" data-id="${l.id}"><div class="icon-box layout-${l.id}">${Array(l.count).fill('<div></div>').join('')}</div><div class="option-text" style="font-size:10px; font-weight:bold;">${l.id}. ${l.name}</div></div>`).join("");
    
    // Helper Updates
    const updateData = () => {
        ['name','age','height','weight','shirt','shoe','eyes'].forEach(id => {
            const v = document.getElementById(`in-${id}`).value;
            const el = document.getElementById(`out-${id}`);
            if(el) el.innerText = v ? (v + (id==='age'?' th':id==='height'?' cm':id==='weight'?' kg':'')) : '-';
        });
        saveState();
    };
    ['name','age','height','weight','shirt','shoe','eyes'].forEach(id => document.getElementById(`in-${id}`).addEventListener('input', updateData));

    const renderGrid = () => {
        const c = document.getElementById('grid-container');
        c.className = `photo-area layout-${currentTemplate}`;
        const cnt = layouts.find(l => l.id === currentTemplate).count;
        c.innerHTML = Array.from({length: cnt}).map((_, i) => {
            const img = images[i] || placeholderImg;
            return `<div class="img-slot slot-${i+1}"><img src="${img}" id="img-${i}"><div class="control-overlay" data-slot="${i}">${img !== placeholderImg ? '<button class="bg-white text-black px-3 py-1 rounded font-bold text-xs border-none shadow-lg">GANTI</button>' : '<i class="fas fa-plus text-white text-3xl"></i>'}</div></div>`;
        }).join("");
        // Bind click untuk cropper
        document.querySelectorAll('.control-overlay').forEach(el => el.addEventListener('click', () => {
            activeSlotIndex = parseInt(el.getAttribute('data-slot'));
            document.getElementById('file-input').click();
        }));
        saveState();
    };

    const setTheme = (mode, color, el) => {
        const root = document.getElementById('comcard-module').style;
        root.setProperty('--bg-gradient', gradients[mode]?.[color] || gradients.light.white);
        root.setProperty('--text-footer', mode === 'dark' ? '#ffffff' : '#000000');
        root.setProperty('--footer-bg', mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.85)');
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        if(el) el.classList.add('active');
        saveState();
    };
    document.querySelectorAll('.color-btn').forEach(b => b.addEventListener('click', (e) => setTheme(e.target.dataset.theme, e.target.dataset.color, e.target)));

    // Event Listeners UI
    document.getElementById("layout-trigger").addEventListener("click", () => layDropdown.classList.toggle("open"));
    document.getElementById("pattern-trigger").addEventListener("click", () => document.getElementById("patternDropdown").classList.toggle("open"));
    document.querySelectorAll(".option-item").forEach(i => i.addEventListener('click', () => {
        currentTemplate = parseInt(i.dataset.id);
        document.getElementById('selected-layout-text').innerText = layouts.find(x => x.id === currentTemplate).name;
        layDropdown.classList.remove('open');
        renderGrid();
    }));

    // CROPPER LOGIC
    document.getElementById('file-input').addEventListener('change', e => {
        const f = e.target.files[0];
        if(f) {
            const r = new FileReader();
            r.onload = ev => {
                if(cropper) cropper.destroy();
                const img = document.getElementById('image-to-crop');
                img.src = ev.target.result;
                document.getElementById('crop-modal').style.display = 'flex';
                setTimeout(() => {
                    const s = document.querySelector(`.slot-${activeSlotIndex+1}`);
                    const ratio = (s && s.offsetWidth > 0) ? s.offsetWidth / s.offsetHeight : 1;
                    cropper = new window.Cropper(img, { aspectRatio: ratio, viewMode: 1, autoCropArea: 1, dragMode: 'move' });
                }, 100);
            };
            r.readAsDataURL(f);
        }
        e.target.value = '';
    });
    document.getElementById('btn-cancel-crop').addEventListener('click', () => { document.getElementById('crop-modal').style.display='none'; if(cropper) cropper.destroy(); });
    document.getElementById('btn-save-crop').addEventListener('click', () => {
        if(cropper) {
            images[activeSlotIndex] = cropper.getCroppedCanvas({ minWidth:800, fillColor:'#fff', imageSmoothingEnabled:true }).toDataURL('image/jpeg', 0.9);
            renderGrid();
            document.getElementById('crop-modal').style.display='none';
            cropper.destroy();
        }
    });

    // SCALING
    const scalePreview = () => {
        const w = document.getElementById('preview-wrapper'), c = document.getElementById('scale-container');
        if(!w || !c) return;
        const aw = w.offsetWidth - 20, s = Math.max(0.1, Math.min(1, aw / 794));
        c.style.transform = `scale(${s})`;
        c.style.marginBottom = `-${1123 - (1123*s)}px`;
    };
    window.addEventListener('resize', scalePreview);

    // DOWNLOAD EXPORT
    const getFilename = (ext) => { const n = document.getElementById('in-name').value.trim(); return `${n ? n.replace(/\\s+/g, '-').toLowerCase() : 'orland-model'}-comcard.${ext}`; };
    const doExport = async (type) => {
        import("/assets/js/notify.js").then(m => m.notify(`Menyiapkan ${type.toUpperCase()}... Mohon tunggu.`, "info"));
        const el = document.getElementById('scale-container');
        const ot = el.style.transform, om = el.style.marginBottom;
        el.style.transform = 'none'; el.style.marginBottom = '0';
        window.scrollTo(0,0);
        
        try {
            const c = await window.html2canvas(document.getElementById('comp-card'), { scale: 2, useCORS: true, width: 794, height: 1123, scrollY: 0 });
            if (type === 'pdf') {
                const p = new window.jspdf.jsPDF('p', 'mm', 'a4');
                p.addImage(c.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
                p.save(getFilename('pdf'));
            } else {
                const link = document.createElement('a'); link.download = getFilename(type);
                link.href = c.toDataURL(`image/${type === 'jpg' ? 'jpeg' : 'png'}`, 0.95); link.click();
            }
            import("/assets/js/notify.js").then(m => m.notify("Berhasil diunduh!", "success"));
        } catch(e) { console.error(e); }
        finally { el.style.transform = ot; el.style.marginBottom = om; scalePreview(); }
    };
    document.getElementById('btn-dl-jpg').addEventListener('click', () => doExport('jpg'));
    document.getElementById('btn-dl-png').addEventListener('click', () => doExport('png'));
    document.getElementById('btn-dl-pdf').addEventListener('click', () => doExport('pdf'));
    document.getElementById('btn-reset').addEventListener('click', () => { if(confirm("Hapus semua draft?")){ localStorage.removeItem('orland_comcard_draft'); window.loadModule('comcard_maker', document.querySelector('[onclick*="comcard_maker"]')); } });

    // 5. RESTORE FROM LOCAL STORAGE
    const draft = JSON.parse(localStorage.getItem('orland_comcard_draft') || 'null');
    if (draft) {
        if(draft.template) currentTemplate = draft.template;
        if(draft.images) draft.images.forEach((img, i) => images[i] = img);
        if(draft.inputs) Object.keys(draft.inputs).forEach(id => { const el = document.getElementById(`in-${id}`); if(el) el.value = draft.inputs[id]; });
        if(draft.themeColor) setTheme(draft.themeMode, draft.themeColor, document.querySelector(`.color-btn[data-color="${draft.themeColor}"]`));
        if(draft.pattern) document.getElementById('active-pattern-layer').className = `pattern-layer ${draft.pattern}`;
        document.getElementById('selected-layout-text').innerText = layouts.find(x => x.id === currentTemplate)?.name || 'Custom';
    } else {
        // Auto fill if talent has profile (Integration with main app)
        try {
            const { state } = await import("/assets/js/state.js");
            if(state && state.user) document.getElementById("in-name").value = state.user.full_name || '';
        } catch(e) {}
    }

    // INIT EXECUTION
    updateData();
    renderGrid();
    setTimeout(scalePreview, 300);
}
