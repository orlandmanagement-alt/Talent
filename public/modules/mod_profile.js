import { apiGet, apiPost } from "/assets/js/api.js";
import { notify } from "/assets/js/notify.js";
import { state as globalState } from "/assets/js/state.js";
import { maskPhone, maskEmail } from "/assets/js/ui.js";
import { maskPhone, maskEmail } from "/assets/js/ui.js";

// =========================================================
// 1. TEMPLATE RENDER (HTML & CSS INJECTIONS)
// =========================================================
export async function render() {
  return `
  <style>
    /* CSS Bawaan Anda + Penambahan Floating Save Bar & Elemen Baru */
    :root{ --bg:#f4f6fb; --card:#ffffff; --muted:#6b7280; --text:#111827; --line:#e5e7eb; --danger-bg:#fde2e2; --danger:#b42318; --primary:#6b8aed; --btn:#6b8aed; --btn2:#4f6bcb; --chip:#eef2ff; --shadow:0 10px 30px rgba(17,24,39,.08); --radius:14px; }
    .wrap-profile{max-width:1100px;margin:0 auto;padding:10px 0 80px;}
    .alert{display:flex;gap:10px;align-items:center;background:var(--danger-bg);color:var(--danger); border:1px solid rgba(180,35,24,.18);padding:10px 12px;border-radius:12px;font-size:13px;margin-bottom:14px}
    .alert .dot{width:10px;height:10px;border-radius:999px;background:var(--danger); box-shadow:0 0 0 4px rgba(180,35,24,.15);flex:0 0 auto}
    .grid-prof{display:grid;grid-template-columns:320px 1fr;gap:16px;align-items:start}
    .card-prof{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
    
    /* LEFT PANEL */
    .side{padding:14px} .side h4{margin:0 0 10px;font-size:12px;letter-spacing:.08em;color:#374151}
    .ph{border:1px dashed #cbd5e1;border-radius:16px;background:linear-gradient(180deg,#f8fafc,#ffffff);padding:12px}
    .avatar{width:100%;aspect-ratio:4/5;border-radius:16px;background:radial-gradient(circle at 45% 35%, #dbeafe 0 22%, transparent 23%), radial-gradient(circle at 50% 28%, #cbd5e1 0 18%, transparent 19%), linear-gradient(#eef2f7,#f8fafc); border:1px solid #e2e8f0;position:relative;overflow:hidden;cursor:pointer}
    .avatar::after{content:"";position:absolute;inset:auto 0 0 0;height:42%; background:radial-gradient(ellipse at 50% 0%, #cbd5e1 0 60%, transparent 61%);opacity:.75}
    .miniRow{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
    .mini{border:1px dashed #cbd5e1;border-radius:14px;padding:10px;background:#fbfdff}
    .mini .miniBox{width:100%;aspect-ratio:4/3;border-radius:12px;border:1px solid #e2e8f0; background:linear-gradient(#f1f5f9,#ffffff);position:relative;cursor:pointer}
    .mini .miniBox::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 45%, rgba(148,163,184,.55) 0 10%, transparent 11%), radial-gradient(circle at 45% 35%, rgba(148,163,184,.45) 0 8%, transparent 9%);opacity:.8}
    .cap{font-size:11px;color:var(--muted);margin:8px 0 10px;line-height:1.35}
    .btn-prof{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%; border:0;padding:10px 12px;border-radius:12px;cursor:pointer;background:var(--btn); color:#fff;font-weight:600;font-size:13px}
    .btn-prof:hover{background:var(--btn2)} .btn-prof.ghost{background:#f1f5f9;color:#0f172a;border:1px solid #e2e8f0}
    .block-prof{margin-top:12px;border-top:1px solid var(--line);padding-top:12px}
    .kv{display:grid;grid-template-columns:1fr;gap:8px;font-size:13px;color:#0f172a}
    .kv .item{display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border:1px solid #eef2f7; border-radius:12px;background:#fbfdff;align-items:center}
    .kv .item span:first-child{color:var(--muted)}
    .kv .item input{width:100%;max-width:210px;border:1px solid #e5e7eb;border-radius:10px; padding:8px 10px;font-size:13px;outline:none;text-align:right;background:#fff}
    .linkAdd{color:var(--btn);font-weight:600;cursor:pointer;white-space:nowrap}

    /* MAIN */
    .main{padding:14px} .topRow{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    .titleWrap h1{margin:0;font-size:28px;line-height:1.1;letter-spacing:-.02em}
    .subMeta{display:flex;gap:10px;align-items:center;margin-top:8px;color:var(--muted);font-size:13px;flex-wrap:wrap}
    
    /* Tabs & Sections */
    .tabs-prof{display:flex;gap:18px;margin-top:14px;border-bottom:1px solid var(--line);padding-bottom:10px}
    .tab{font-weight:700;color:var(--muted);font-size:14px;position:relative;padding-bottom:10px;cursor:pointer;user-select:none}
    .tab.active{color:#0f172a} .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-11px;height:3px;border-radius:999px;background:var(--primary)}
    .section{margin-top:14px;border:1px solid var(--line);border-radius:14px;background:#fff;overflow:visible}
    .sectionHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px;background:#f8fafc; border-bottom:1px solid var(--line)}
    .sectionHead .label{font-weight:900;letter-spacing:.06em;font-size:12px;color:#374151}
    .sectionHead .add{font-weight:900;color:var(--btn);cursor:pointer;font-size:13px}
    .sectionBody{padding:12px;font-size:14px;color:var(--muted);overflow:visible}
    
    /* Fields */
    .twoCol{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .field-prof{border:1px solid #eef2f7;border-radius:12px;padding:10px 10px;background:#fff}
    .field-prof .k{font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:800}
    .field-prof .v{font-size:14px;color:#0f172a;font-weight:900}
    .miniBtn{border:1px solid #e2e8f0;background:#fff;color:#0f172a;font-weight:900;font-size:12px;padding:7px 10px; border-radius:10px;cursor:pointer}
    .miniBtn.primary{background:var(--btn);border-color:transparent;color:#fff}
    .formGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .frow{display:flex;flex-direction:column;gap:6px}
    .frow label{font-size:12px;color:var(--muted);font-weight:900}
    .frow input,.frow select,.frow textarea{border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;outline:none; font-size:13px;background:#fff;font:inherit}
    .frow textarea{min-height:92px;resize:vertical}
    
    /* Elements */
    .panel{display:none} .panel.active{display:block}
    .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    .chip{background:var(--chip);border:1px solid #e0e7ff;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:900; color:#111827;display:inline-flex;align-items:center;gap:8px}
    .chip .x{width:18px;height:18px;border-radius:999px;display:grid;place-items:center;background:#fff;border:1px solid var(--line); color:#ef4444;font-weight:900;cursor:pointer;line-height:1}
    .avatar.hasPhoto,.miniBox.hasPhoto{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important}
    .avatar.hasPhoto::after,.miniBox.hasPhoto::before{display:none}
    
    @media (max-width:900px){ .grid-prof{grid-template-columns:1fr} .side{order:1} .main{order:0} }
    @media (max-width:520px){ .formGrid{grid-template-columns:1fr!important} }

    /* MODAL CROPPER */
    .modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px}
    .modal[hidden]{display:none}
    .modalBackdrop{position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(2px)}
    .modalCard{position:relative;width:100%;max-width:720px;background:#fff;border-radius:18px;box-shadow:0 25px 60px rgba(0,0,0,.25); overflow:hidden; z-index:10000}
    .modalHead{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--line)}
    .modalBody{padding:14px 16px}

    /* FLOATING SAVE BAR */
    .floating-save-bar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--line); padding: 16px 24px; display: flex; justify-content: flex-end; align-items: center; gap: 16px; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); z-index: 9000; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .floating-save-bar.visible { transform: translateY(0); }
    .floating-save-bar .msg { font-size: 13px; font-weight: 600; color: #d97706; display: flex; align-items: center; gap: 8px; }
  </style>

  <div class="wrap-prof wrap">
    <div id="prof-loading" class="flex flex-col items-center justify-center py-20 text-primary">
        <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4"></i>
        <p class="font-semibold">Memuat Profil Database...</p>
    </div>

    <div id="prof-content" class="grid-prof" style="display:none;">
      <aside class="card-prof side">
        <div id="sidebarfoto">
          <h4>FOTO PROFIL (HEADSHOT)</h4>
          <div class="ph">
            <div class="photoWrap" id="wrapHeadshot">
              <div class="avatar" id="photoHeadshot" data-photo-box="headshot" title="Klik untuk ubah"></div>
            </div>
            <div class="cap"><span class="linkAdd" data-upload="headshot">Upload / Ubah</span><br>Format: JPG, PNG, WEBP</div>
          </div>

          <div class="block-prof">
            <div class="miniRow">
              <div>
                <h4 style="margin:0 0 8px;">FOTO SAMPING</h4>
                <div class="mini">
                  <div class="photoWrap" id="wrapSide">
                    <div class="miniBox" id="photoSide" data-photo-box="side"></div>
                  </div>
                </div>
              </div>
              <div>
                <h4 style="margin:0 0 8px;">FULL BODY</h4>
                <div class="mini">
                  <div class="photoWrap" id="wrapFull">
                    <div class="miniBox" id="photoFull" data-photo-box="full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="block-prof">
            <button type="button" onclick="window.ProfileSync.openCompCard()" class="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-2">
                <i class="fa-solid fa-id-badge text-yellow-400"></i> Lihat Comp Card
            </button>
        </div>

        <div class="block-prof mt-3">
            <button type="button" onclick="window.ProfileSync.shareLink()" class="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors active:scale-95 flex items-center justify-center gap-2">
                <i class="fa-solid fa-share-nodes text-primary"></i> Salin Link Portofolio Publik
            </button>
        </div>

  <div class="block-prof" id="contactsCard">
          <div class="rowHead"><h4 style="margin:0;">KONTAK</h4><button class="miniBtn" type="button" id="btnEditContacts">Edit</button></div>
          <div class="kv" id="contactView">
            <div class="item"><span>📞</span><span id="txtPhone">-</span></div>
            <div class="item"><span>✉️</span><span id="txtEmail">-</span></div>
          </div>
        </div>
      </aside>

      <main class="card-prof main">
        <div class="topRow">
          <div class="titleWrap">
            <h1 id="headerName" style="cursor:pointer;" title="Klik untuk edit">Memuat Nama...</h1>
            <div class="subMeta">
              <span class="bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full text-xs font-black shadow-sm"><i class="fa-solid fa-star"></i> <span id="headerRating">0</span> / 10.000</span>
              <span id="headerProfession" class="font-bold text-primary ml-2">Memuat Profesi...</span>
            </div>
          </div>
        </div>

        <div class="tabs-prof" id="tabs">
          <div class="tab active" data-tab="info">Informasi Dasar</div>
          <div class="tab" data-tab="bio">Bio & Rate Card</div>
          <div class="tab" data-tab="photos">Galeri Portofolio</div>
        </div>

        <section class="panel active" id="panel-info">
          
          <div class="section">
            <div class="sectionHead"><div class="label">KATEGORI & KEAHLIAN:</div></div>
            <div class="sectionBody">
              <div class="flex gap-2 mb-3">
                <input type="text" id="inpSkill" placeholder="Ketik keahlian (Cth: Akting, MC)..." class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
                <button type="button" class="bg-primary text-white px-4 rounded-lg text-sm font-bold" id="btnAddSkill">Tambah</button>
              </div>
              <div class="chips" id="listSkills"></div><div class="mt-3 flex flex-wrap gap-2" id="skill-suggestions"></div>
            </div>
          </div>

          <div class="section" id="secPersonal">
            <div class="sectionHead">
              <div class="label">DATA PRIBADI:</div>
              <div class="add" id="btnEditPersonal">✎ Edit</div>
            </div>
            <div class="sectionBody" id="personalView">
              <div class="twoCol">
                <div class="field-prof"><div class="k">Gender</div><div class="v" id="txtGender">-</div></div>
                <div class="field-prof"><div class="k">Tanggal Lahir</div><div class="v" id="txtDob">-</div></div>
                <div class="field-prof"><div class="k">Lokasi Kota</div><div class="v" id="txtLoc">-</div></div>
                <div class="field-prof"><div class="k">Tinggi Badan (cm)</div><div class="v" id="txtHeight">-</div></div>
              </div>
            </div>
            <div class="sectionBody" id="personalEdit" hidden>
              <div class="formGrid">
                <div class="frow"><label>Gender</label><select id="inpGender"><option>Laki-Laki</option><option>Perempuan</option></select></div>
                <div class="frow"><label>Tanggal Lahir</label><input type="date" id="inpDob"></div>
                <div class="frow"><label>Lokasi Kota</label><input type="text" id="inpLoc" placeholder="Cth: Jakarta Selatan"></div>
                <div class="frow"><label>Tinggi Badan (cm)</label><input type="number" id="inpHeight" placeholder="Cth: 175"></div>
              </div>
            </div>
          </div>
        </section>

        <section class="panel" id="panel-bio">
          <div class="section">
            <div class="sectionHead"><div class="label">DESKRIPSI DIRI (BIO) & PENGALAMAN:</div></div>
            <div class="sectionBody">
              <textarea id="inpBio" class="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-primary min-h-[120px]" placeholder="Ceritakan pengalaman, prestasi, dan karakter Anda..."></textarea>
            </div>
          </div>

          <div class="section">
            <div class="sectionHead"><div class="label">RATE CARD (TARIF JASA):</div></div>
            <div class="sectionBody formGrid">
              <div class="frow"><label>Tarif Per Jam (Rp)</label><input type="number" id="inpRateHourly" placeholder="Cth: 150000"></div>
              <div class="frow"><label>Tarif Per Proyek (Rp)</label><input type="number" id="inpRateProject" placeholder="Cth: 2000000"></div>
            </div>
          </div>
        </section>

        <section class="panel" id="panel-photos">
            <div class="p-6 text-center text-gray-500">
                <i class="fa-regular fa-images text-4xl mb-3"></i>
                <p>Klik foto di panel sebelah kiri untuk mengubah portofolio utama Anda.</p>
                <p class="text-xs mt-2">Sistem Cropper otomatis memotong foto sesuai resolusi standar.</p>
            </div>
        </section>
      </main>
    </div>
  </div>

  <div id="floatingSaveBar" class="floating-save-bar">
      <div class="msg"><i class="fa-solid fa-triangle-exclamation"></i> Ada perubahan yang belum disimpan!</div>
      <button class="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-300 transition-colors" onclick="window.ProfileSync.revert()">Batal</button>
      <button class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-600 transition-colors" onclick="window.ProfileSync.saveToApi()">Simpan Perubahan</button>
  </div>

  <div class="modal" id="modalName" hidden>
    <div class="modalBackdrop" data-close="modalName"></div>
    <div class="modalCard" style="max-width:520px;">
      <div class="modalHead"><h3>Identitas Profil</h3><button class="modalClose" data-close="modalName">×</button></div>
      <div class="modalBody">
        <div class="formGrid">
          <div class="frow"><label>Nama Lengkap</label><input id="nameFull" type="text"></div>
          <div class="frow"><label>Kategori / Profesi Utama</label><select id="inpProfession" class="w-full border border-gray-300 rounded-xl p-3 focus:border-primary outline-none text-sm"><option value="">Memuat Profesi...</option></select></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px;">
          <button class="bg-primary text-white px-5 py-2 rounded-lg font-bold" onclick="window.ProfileSync.applyName()">Terapkan</button>
        </div>
      </div>
    </div>
  </div>

  <input type="file" id="fileInput" accept="image/png, image/jpeg, image/webp" hidden>
  
  <div class="modal" id="modalCrop" hidden>
    <div class="modalBackdrop" data-close="modalCrop"></div>
    <div class="modalCard" style="max-width:720px;">
      <div class="modalHead"><h3>Potong Foto</h3><button class="modalClose" data-close="modalCrop">×</button></div>
      <div class="modalBody">
        <div style="border:1px solid var(--line);border-radius:14px;padding:10px;background:#f8fafc; max-height:60vh; overflow:hidden; display:flex; justify-content:center;">
          <img id="cropTarget" src="" alt="Target" style="display:block;max-width:100%; max-height:100%;">
        </div>
        <div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">
          <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold" data-close="modalCrop">Batal</button>
          <button class="bg-primary text-white px-5 py-2 rounded-lg font-bold" id="btnCropApply">Terapkan Foto</button>
        </div>
      </div>
    </div>
  </div>
  `;
}

// =========================================================
// 2. INITIALIZE EVENTS & LOGIC (State, Cropper, Dirty Check)
// =========================================================
export async function initEvents() {
  const qs = (id) => document.getElementById(id);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));

  // 1. LOAD CROPPER JS DINAMIS JIKA BELUM ADA
  if (!document.getElementById('cropper-css')) {
      const link = document.createElement('link'); link.id = 'cropper-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/cropperjs@1.6.2/dist/cropper.min.css';
      document.head.appendChild(link);
  }
  if (!window.Cropper) {
      await new Promise(resolve => {
          const script = document.createElement('script'); script.src = 'https://unpkg.com/cropperjs@1.6.2/dist/cropper.min.js'; script.onload = resolve; document.head.appendChild(script);
      });
  }

  // 2. STATE MANAGEMENT (DIRTY CHECKER)
  const DEFAULT = {
    full_name: "", profession: "",
    contacts: { phone: "", email: "" },
    personal: { gender: "Laki-Laki", dob: "", loc: "", height: "" },
    bio: "", rates: { hourly: "", project: "" },
    skills: [],
    photos: { headshot: "", side: "", full: "" } // Nantinya ini berisi URL Cloud
  };

    // FETCH MASTER DATA UNTUK DROPDOWN
    apiGet("/functions/api/public/master_data").then(res => {
        if(res.ok && res.data) {
            const profSelect = document.getElementById("inpProfession");
            if(profSelect && res.data.profession) {
                profSelect.innerHTML = `<option value="">-- Pilih Profesi Utama --</option>` + res.data.profession.map(p => `<option value="${p}">${p}</option>`).join("");
                profSelect.value = currentState.profession || "";
            }
            // Render Skills Suggestions
            const skillSugg = document.getElementById("skill-suggestions");
            if(skillSugg && res.data.skill) {
                skillSugg.innerHTML = res.data.skill.map(s => `<button type="button" class="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary hover:text-white" onclick="document.getElementById('inpSkill').value='${s}'; document.getElementById('btnAddSkill').click();">${s}</button>`).join("");
            }
        }
    });

  let originalState = {};
  let currentState = {};

  // FUNGSI CEK PERUBAHAN
  function checkDirty() {
      const isDirty = JSON.stringify(originalState) !== JSON.stringify(currentState);
      const bar = qs("floatingSaveBar");
      if (bar) {
          if (isDirty) bar.classList.add("visible");
          else bar.classList.remove("visible");
      }
  }

  function updateState(key, val, subKey = null) {
      if (subKey) currentState[key][subKey] = val;
      else currentState[key] = val;
      checkDirty();
  }

  // 3. TARIK DATA DARI API (BUKAN LOCALSTORAGE)
  const res = await apiGet("/functions/api/talent/profile_get");
  qs("prof-loading").style.display = "none";
  qs("prof-content").style.display = "grid";

  if (res.ok && res.data) {
      // Menggabungkan data API dengan Default
      const d = res.data;
      originalState = {
          full_name: d.full_name || globalState?.user?.full_name || "",
          profession: d.profession || "",
          contacts: { phone: d.phone || globalState?.user?.phone || "", email: d.email || globalState?.user?.email || "" },
          personal: { gender: d.personal?.gender || "Laki-Laki", dob: d.personal?.dob || "", loc: d.personal?.loc || "", height: d.personal?.height || "" },
          bio: d.bio || "",
          rates: { hourly: d.rates?.hourly || "", project: d.rates?.project || "" },
          skills: Array.isArray(d.skills) ? d.skills : [],
          photos: { headshot: d.photos?.headshot || "", side: d.photos?.side || "", full: d.photos?.full || "" }
      };
  } else {
      originalState = JSON.parse(JSON.stringify(DEFAULT));
      originalState.full_name = globalState?.user?.full_name || "";
      originalState.contacts.email = globalState?.user?.email || "";
  }
  
  currentState = JSON.parse(JSON.stringify(originalState));

  // 4. RENDER UI DARI STATE
  function renderAll() {
      // Header
      qs("headerName").textContent = currentState.full_name || "Nama Belum Diatur";
      qs("headerProfession").textContent = currentState.profession || "Kategori Belum Dipilih";
      qs("headerRating").textContent = (res.data?.rating_score || 0).toLocaleString("id-ID");
      
      // Contacts
      qs("txtPhone").textContent = maskPhone(currentState.contacts.phone);
      qs("txtEmail").textContent = maskEmail(currentState.contacts.email);
      
      // Personal
      qs("txtGender").textContent = currentState.personal.gender || "-";
      qs("txtDob").textContent = currentState.personal.dob || "-";
      qs("txtLoc").textContent = currentState.personal.loc || "-";
      qs("txtHeight").textContent = currentState.personal.height ? currentState.personal.height + " cm" : "-";
      
      // Bio & Rates
      qs("inpBio").value = currentState.bio;
      qs("inpRateHourly").value = currentState.rates.hourly;
      qs("inpRateProject").value = currentState.rates.project;

      // Skills
      const sCont = qs("listSkills");
      sCont.innerHTML = "";
      currentState.skills.forEach(s => {
          const chip = document.createElement("div"); chip.className = "chip";
          chip.innerHTML = `<span>${s}</span><span class="x">×</span>`;
          chip.querySelector(".x").onclick = () => { currentState.skills = currentState.skills.filter(x => x !== s); checkDirty(); renderAll(); };
          sCont.appendChild(chip);
      });

      // Photos
      ["headshot", "side", "full"].forEach(k => {
          const box = qs("photo" + k.charAt(0).toUpperCase() + k.slice(1));
          if(box) {
              const url = currentState.photos[k];
              box.style.backgroundImage = url ? `url("${url}")` : "";
              box.classList.toggle("hasPhoto", !!url);
          }
      });
  }

  // 5. EVENT BINDINGS
  // Tabs
  qs("tabs").addEventListener("click", (e) => {
      const tab = e.target.closest(".tab"); if (!tab) return;
      qsa(".tab").forEach(t => t.classList.remove("active")); tab.classList.add("active");
      qsa(".panel").forEach(p => p.classList.remove("active"));
      qs("panel-" + tab.dataset.tab).classList.add("active");
  });

  // Modals
  qsa('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => { qs(btn.dataset.close).hidden = true; });
  });

  // Edit Name
  qs("headerName").onclick = () => {
      qs("nameFull").value = currentState.full_name;
      qs("inpProfession").value = currentState.profession;
      qs("modalName").hidden = false;
  };
  
  // Edit Contacts & Personal (Toggle UI)
  qs("btnEditContacts").onclick = function() {
      if (this.textContent === "Edit") {
          qs("txtPhone").innerHTML = `<input id="editPhone" value="${currentState.contacts.phone}" class="border rounded px-2 py-1 text-right">`;
          this.textContent = "Selesai";
      } else {
          updateState('contacts', qs("editPhone").value, 'phone');
          renderAll(); this.textContent = "Edit";
      }
  };

  qs("btnEditPersonal").onclick = function() {
      if (qs("personalView").hidden) {
          updateState('personal', qs("inpGender").value, 'gender');
          updateState('personal', qs("inpDob").value, 'dob');
          updateState('personal', qs("inpLoc").value, 'loc');
          updateState('personal', qs("inpHeight").value, 'height');
          qs("personalView").hidden = false; qs("personalEdit").hidden = true; this.textContent = "✎ Edit";
          renderAll();
      } else {
          qs("inpGender").value = currentState.personal.gender;
          qs("inpDob").value = currentState.personal.dob;
          qs("inpLoc").value = currentState.personal.loc;
          qs("inpHeight").value = currentState.personal.height;
          qs("personalView").hidden = true; qs("personalEdit").hidden = false; this.textContent = "✓ Selesai";
      }
  };

  // Inputs Bawah (Langsung Deteksi Ketikan)
  qs("inpBio").oninput = (e) => updateState('bio', e.target.value);
  qs("inpRateHourly").oninput = (e) => updateState('rates', e.target.value, 'hourly');
  qs("inpRateProject").oninput = (e) => updateState('rates', e.target.value, 'project');

  // Skills
  qs("btnAddSkill").onclick = () => {
      const v = qs("inpSkill").value.trim();
      if (v && !currentState.skills.includes(v)) { currentState.skills.push(v); updateState('skills', currentState.skills); renderAll(); qs("inpSkill").value = ""; }
  };

  // CROPPER LOGIC
  let cropper = null; let currentTargetPhoto = "";
  function destroyCropper(){ if(cropper) cropper.destroy(); cropper=null; }

  qsa("[data-photo-box]").forEach(el => {
      el.onclick = () => { currentTargetPhoto = el.dataset.photoBox; qs("fileInput").click(); }
  });

  qs("fileInput").onchange = (e) => {
      const file = e.target.files[0]; if(!file) return;
      const r = new FileReader();
      r.onload = () => {
          const img = qs("cropTarget"); img.src = r.result;
          qs("modalCrop").hidden = false; destroyCropper();
          // Aspect Ratio (Headshot & Full: 3/4, Side: Bebas/Menyesuaikan)
          cropper = new Cropper(img, { aspectRatio: 3/4, viewMode: 1, autoCropArea: 1 });
      };
      r.readAsDataURL(file); e.target.value = "";
  };

  qs("btnCropApply").onclick = () => {
      if(!cropper) return;
      const canvas = cropper.getCroppedCanvas({ maxWidth: 800, maxHeight: 1000, imageSmoothingQuality: "high" });
      const dataUrl = canvas.toDataURL("image/webp", 0.8);
      
      // Simpan Base64 ke State. 
      // CATATAN SKALA BESAR: Saat saveToApi(), Backend Anda harus menerima Base64 ini,
      // menguploadnya ke R2/S3, dan menyimpan link-nya ke database SQL.
      updateState('photos', dataUrl, currentTargetPhoto);
      
      destroyCropper(); qs("modalCrop").hidden = true; renderAll();
  };

  // 6. GLOBAL FUNCTIONS (Diakses dari HTML)
  window.ProfileSync = {
      applyName: () => {
          updateState('full_name', qs("nameFull").value);
          updateState('profession', qs("inpProfession").value);
          qs("modalName").hidden = true; renderAll();
      },
      revert: () => {
          currentState = JSON.parse(JSON.stringify(originalState));
          renderAll(); checkDirty();
      },
        
        shareLink: async () => {
            try {
                const { state } = await import("/assets/js/state.js");
                if(state && state.user && state.user.id) {
                    const link = window.location.origin + '/p.html?id=' + state.user.id;
                    await navigator.clipboard.writeText(link);
                    notify("Link Portofolio Publik berhasil disalin! Silakan paste di Bio IG Anda.", "success");
                } else {
                    notify("ID Pengguna tidak ditemukan.", "error");
                }
            } catch(e) { notify("Gagal menyalin link.", "error"); }
        },
        openCompCard: () => {

            if (!currentState.photos.headshot) return notify("Anda wajib mengunggah Foto Profil (Headshot) terlebih dahulu!", "error");
            
            const qsCC = (id) => document.getElementById(id);
            qsCC("cc_name").textContent = currentState.full_name || "Nama Talent";
            qsCC("cc_profession").textContent = currentState.profession || "UNCATEGORIZED";
            qsCC("cc_height").textContent = currentState.personal.height ? currentState.personal.height + " cm" : "-";
            qsCC("cc_gender").textContent = currentState.personal.gender || "-";
            qsCC("cc_loc").textContent = currentState.personal.loc || "-";
            qsCC("cc_dob").textContent = currentState.personal.dob || "-";
            
            qsCC("cc_main_photo").style.backgroundImage = `url('${currentState.photos.headshot}')`;
            qsCC("cc_side_photo").style.backgroundImage = currentState.photos.side ? `url('${currentState.photos.side}')` : "none";
            qsCC("cc_full_photo").style.backgroundImage = currentState.photos.full ? `url('${currentState.photos.full}')` : "none";
            
            const skillHtml = (currentState.skills || []).map(s => `<span class="bg-gray-800 text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider">${s}</span>`).join("");
            qsCC("cc_skills").innerHTML = skillHtml || `<span class="text-xs text-gray-400">-</span>`;
            
            qs("modalCompCard").hidden = false;
        },
        downloadCompCard: async (type) => {
            notify("Menyiapkan " + type.toUpperCase() + "...", "info");
            const element = document.getElementById("comp-card-export-area");
            const fileName = `CompCard_${(currentState.full_name || "Talent").replace(/\s+/g, "_")}`;
            
            try {
                if (type === "jpg" || type === "png") {
                    if (!window.html2canvas) {
                        await new Promise(r => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"; s.onload = r; document.head.appendChild(s); });
                    }
                    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
                    const link = document.createElement("a");
                    link.download = fileName + "." + type;
                    link.href = canvas.toDataURL(`image/${type === "jpg" ? "jpeg" : "png"}`, 0.95);
                    link.click();
                    notify("Berhasil diunduh!", "success");
                } else if (type === "pdf") {
                    if (!window.html2pdf) {
                        await new Promise(r => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"; s.onload = r; document.head.appendChild(s); });
                    }
                    const opt = {
                        margin: 0,
                        filename: fileName + ".pdf",
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
                    };
                    html2pdf().set(opt).from(element).save().then(() => notify("PDF Berhasil diunduh!", "success"));
                }
            } catch(e) {
                notify("Terjadi kesalahan saat membuat file.", "error");
            }
        },
      saveToApi: async () => {
          notify("Menyimpan ke database...", "info");
          // Eksekusi API POST (Kirim currentState)
          const res = await apiPost("/functions/api/talent/profile_update", currentState);
          if (res.ok) {
              notify("Profil berhasil disimpan!", "success");
              // Update Original State = Current State
              originalState = JSON.parse(JSON.stringify(currentState));
              checkDirty(); // Ini akan menyembunyikan Floating Bar
          } else {
              notify("Gagal menyimpan: " + (res.data?.message || "Server Error"), "error");
          }
      }
  };

  // Render Pertama Kali
  renderAll();
}
