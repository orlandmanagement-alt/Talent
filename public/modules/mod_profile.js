import { apiGet, apiPost } from "/assets/js/api.js";

export async function render() {
  return `
  <link rel="stylesheet" href="https://unpkg.com/cropperjs@1.6.2/dist/cropper.min.css">

  <style>
    /* Mengisolasi CSS agar tidak merusak layout dashboard utama */
    #talent-profile-module {
      --bg:#f4f6fb; --card:#ffffff; --muted:#6b7280; --text:#111827; --line:#e5e7eb;
      --danger-bg:#fde2e2; --danger:#b42318; --primary:#7c3aed;
      --btn:#2563eb; --btn2:#1d4ed8; --chip:#eef2ff; --shadow:0 10px 30px rgba(17,24,39,.08);
      --radius:14px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: var(--text);
      padding-bottom: 40px;
    }
    #talent-profile-module * { box-sizing:border-box; }
    
    /* ===== CSS ASLI DARI ANDA ===== */
    #talent-profile-module .alert{display:flex;gap:10px;align-items:center;background:var(--danger-bg);color:var(--danger);border:1px solid rgba(180,35,24,.18);padding:10px 12px;border-radius:12px;font-size:13px;margin-bottom:14px}
    #talent-profile-module .alert .dot{width:10px;height:10px;border-radius:999px;background:var(--danger);box-shadow:0 0 0 4px rgba(180,35,24,.15);flex:0 0 auto}
    #talent-profile-module .grid{display:grid;grid-template-columns:320px 1fr;gap:16px;align-items:start}
    #talent-profile-module .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
    #talent-profile-module .side{padding:14px}
    #talent-profile-module .side h4{margin:0 0 10px;font-size:12px;letter-spacing:.08em;color:#374151}
    #talent-profile-module .ph{border:1px dashed #cbd5e1;border-radius:16px;background:linear-gradient(180deg,#f8fafc,#ffffff);padding:12px}
    #talent-profile-module .avatar{width:100%;aspect-ratio:4/5;border-radius:16px;background:radial-gradient(circle at 45% 35%, #dbeafe 0 22%, transparent 23%),radial-gradient(circle at 50% 28%, #cbd5e1 0 18%, transparent 19%),linear-gradient(#eef2f7,#f8fafc);border:1px solid #e2e8f0;position:relative;overflow:hidden;cursor:pointer}
    #talent-profile-module .avatar::after{content:"";position:absolute;inset:auto 0 0 0;height:42%;background:radial-gradient(ellipse at 50% 0%, #cbd5e1 0 60%, transparent 61%);opacity:.75}
    #talent-profile-module .miniRow{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
    #talent-profile-module .mini{border:1px dashed #cbd5e1;border-radius:14px;padding:10px;background:#fbfdff}
    #talent-profile-module .mini .miniBox{width:100%;aspect-ratio:4/3;border-radius:12px;border:1px solid #e2e8f0;background:linear-gradient(#f1f5f9,#ffffff);position:relative;cursor:pointer}
    #talent-profile-module .mini .miniBox::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 45%, rgba(148,163,184,.55) 0 10%, transparent 11%),radial-gradient(circle at 45% 35%, rgba(148,163,184,.45) 0 8%, transparent 9%);opacity:.8}
    #talent-profile-module .cap{font-size:11px;color:var(--muted);margin:8px 0 10px;line-height:1.35}
    #talent-profile-module .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;border:0;padding:10px 12px;border-radius:12px;cursor:pointer;background:var(--btn);color:#fff;font-weight:600;font-size:13px}
    #talent-profile-module .btn:hover{background:var(--btn2)}
    #talent-profile-module .btn.ghost{background:#f1f5f9;color:#0f172a;border:1px solid #e2e8f0}
    #talent-profile-module .block{margin-top:12px;border-top:1px solid var(--line);padding-top:12px}
    #talent-profile-module .kv{display:grid;grid-template-columns:1fr;gap:8px;font-size:13px;color:#0f172a}
    #talent-profile-module .kv .item{display:flex;justify-content:space-between;gap:10px;padding:8px 10px;border:1px solid #eef2f7;border-radius:12px;background:#fbfdff;align-items:center}
    #talent-profile-module .kv .item span:first-child{color:var(--muted)}
    #talent-profile-module .kv .item input{width:100%;max-width:210px;border:1px solid #e5e7eb;border-radius:10px;padding:8px 10px;font-size:13px;outline:none;text-align:right;background:#fff}
    #talent-profile-module .kv .item input:focus{border-color:#93c5fd;box-shadow:0 0 0 4px rgba(59,130,246,.12)}
    #talent-profile-module .linkAdd{color:var(--btn);font-weight:600;cursor:pointer;white-space:nowrap}
    #talent-profile-module .main{padding:14px}
    #talent-profile-module .topRow{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    #talent-profile-module .titleWrap h1{margin:0;font-size:28px;line-height:1.1;letter-spacing:-.02em}
    #talent-profile-module .subMeta{display:flex;gap:10px;align-items:center;margin-top:8px;color:var(--muted);font-size:13px;flex-wrap:wrap}
    #talent-profile-module .rating{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;font-weight:700}
    #talent-profile-module .star{width:14px;height:14px;display:inline-block;background:conic-gradient(from 0deg,#fbbf24,#f59e0b,#fbbf24);clip-path:polygon(50% 0%, 62% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 38% 35%)}
    #talent-profile-module .tabs{display:flex;gap:18px;margin-top:14px;border-bottom:1px solid var(--line);padding-bottom:10px}
    #talent-profile-module .tab{font-weight:700;color:var(--muted);font-size:14px;position:relative;padding-bottom:10px;cursor:pointer;user-select:none}
    #talent-profile-module .tab.active{color:#0f172a}
    #talent-profile-module .tab.active::after{content:"";position:absolute;left:0;right:0;bottom:-11px;height:3px;border-radius:999px;background:var(--primary)}
    #talent-profile-module .progressWrap{margin-top:14px;border:1px solid #fde68a;background:#fffbeb;border-radius:14px;padding:12px}
    #talent-profile-module .progressHead{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:13px;color:#92400e;font-weight:800;margin-bottom:10px}
    #talent-profile-module .bar{height:10px;border-radius:999px;background:#feecc8;overflow:hidden;border:1px solid rgba(146,64,14,.12)}
    #talent-profile-module .bar>div{height:100%;width:0%;background:linear-gradient(90deg,#fb7185,#f59e0b);border-radius:999px;transition:width .25s ease}
    #talent-profile-module .hint{margin-top:10px;font-size:13px;color:#78350f;display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}
    #talent-profile-module .hint a{color:#1d4ed8;text-decoration:none;font-weight:700}
    #talent-profile-module .section{margin-top:14px;border:1px solid var(--line);border-radius:14px;background:#fff;overflow:visible}
    #talent-profile-module .sectionHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 12px;background:#f8fafc;border-bottom:1px solid var(--line)}
    #talent-profile-module .sectionHead .label{font-weight:900;letter-spacing:.06em;font-size:12px;color:#374151}
    #talent-profile-module .sectionHead .add{font-weight:900;color:var(--btn);cursor:pointer;font-size:13px}
    #talent-profile-module .sectionBody{padding:12px;font-size:14px;color:var(--muted);overflow:visible}
    #talent-profile-module .empty{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:12px;border:1px dashed #cbd5e1;border-radius:12px;background:#fbfdff;color:#64748b}
    #talent-profile-module .twoCol{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    #talent-profile-module .field{border:1px solid #eef2f7;border-radius:12px;padding:10px 10px;background:#fff}
    #talent-profile-module .field .k{font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:800}
    #talent-profile-module .field .v{font-size:14px;color:#0f172a;font-weight:900}
    #talent-profile-module .rowHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
    #talent-profile-module .miniBtn{border:1px solid #e2e8f0;background:#fff;color:#0f172a;font-weight:900;font-size:12px;padding:7px 10px;border-radius:10px;cursor:pointer}
    #talent-profile-module .miniBtn.primary{background:var(--btn);border-color:transparent;color:#fff}
    #talent-profile-module .miniBtn:hover{filter:brightness(.98)}
    #talent-profile-module .formGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media(max-width:520px){#talent-profile-module .formGrid{grid-template-columns:1fr}}
    #talent-profile-module .frow{display:flex;flex-direction:column;gap:6px}
    #talent-profile-module .frow label{font-size:12px;color:var(--muted);font-weight:900}
    #talent-profile-module .frow input,#talent-profile-module .frow select,#talent-profile-module .frow textarea{border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;outline:none;font-size:13px;background:#fff;font:inherit}
    #talent-profile-module .frow textarea{min-height:92px;resize:vertical}
    #talent-profile-module .frow input:focus,#talent-profile-module .frow select:focus,#talent-profile-module .frow textarea:focus{border-color:#93c5fd;box-shadow:0 0 0 4px rgba(59,130,246,.12)}
    #talent-profile-module .panel{display:none}
    #talent-profile-module .panel.active{display:block}
    #talent-profile-module .dropdown{position:relative;margin-bottom:10px;z-index:1}
    #talent-profile-module .dropdown.is-open{z-index:100000}
    #talent-profile-module .dd-btn{width:100%;display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);background:#fff;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:900;font-size:13px;color:#0f172a}
    #talent-profile-module .dd-btn:hover{background:#f9fafb}
    #talent-profile-module .dd-panel{position:absolute;left:0;right:0;top:calc(100% + 6px);border:1px solid var(--line);background:#fff;border-radius:14px;box-shadow:var(--shadow);padding:8px;z-index:99999;max-height:260px;overflow:auto}
    #talent-profile-module .dd-item{display:flex;align-items:center;gap:10px;padding:8px 8px;border-radius:10px;cursor:pointer}
    #talent-profile-module .dd-item:hover{background:#f8fafc}
    #talent-profile-module .dd-item input{transform:scale(1.05)}
    #talent-profile-module .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    #talent-profile-module .chip{background:var(--chip);border:1px solid #e0e7ff;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:900;color:#111827;display:inline-flex;align-items:center;gap:8px}
    #talent-profile-module .chip .x{width:18px;height:18px;border-radius:999px;display:grid;place-items:center;background:#fff;border:1px solid var(--line);color:#ef4444;font-weight:900;cursor:pointer;line-height:1}
    #talent-profile-module .chip .x:hover{background:#fee2e2;border-color:#fecaca}
    #talent-profile-module .mutedHelp{margin-top:10px;font-size:12px;color:var(--muted);line-height:1.4}
    #talent-profile-module .skillInput{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:12px;padding:8px;background:#fff}
    #talent-profile-module .skillInput input{border:none;outline:none;flex:1;font-size:13px}
    #talent-profile-module .skillInput .cc{font-size:11px;color:var(--muted);font-weight:900;white-space:nowrap}
    #talent-profile-module .avatar.hasPhoto, #talent-profile-module .miniBox.hasPhoto{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important}
    #talent-profile-module .avatar.hasPhoto::after, #talent-profile-module .miniBox.hasPhoto::before{display:none}
    #talent-profile-module .socialList{display:grid;gap:10px}
    #talent-profile-module .socialRow{display:flex;justify-content:space-between;gap:10px;align-items:center;border:1px solid #eef2f7;border-radius:12px;padding:8px 10px;background:#fbfdff;font-size:13px}
    #talent-profile-module .socialTag{font-weight:900;color:#0f172a;flex:0 0 auto}
    #talent-profile-module .socialUrl{color:#2563eb;font-weight:900;word-break:break-all;text-align:right;text-decoration:none}
    #talent-profile-module .socialUrl:hover{text-decoration:underline}
    #talent-profile-module .modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px}
    #talent-profile-module .modal[hidden]{display:none}
    #talent-profile-module .modalBackdrop{position:absolute;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(2px)}
    #talent-profile-module .modalCard{position:relative;width:100%;max-width:720px;background:#fff;border-radius:18px;box-shadow:0 25px 60px rgba(0,0,0,.25);overflow:hidden}
    #talent-profile-module .modalHead{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--line)}
    #talent-profile-module .modalHead h3{margin:0;font-size:16px;font-weight:900}
    #talent-profile-module .modalClose{border:none;background:transparent;font-size:22px;cursor:pointer;color:#64748b}
    #talent-profile-module .modalBody{padding:14px 16px}
    #talent-profile-module .progress-layout{display:flex;gap:26px;align-items:flex-start}
    @media(max-width:720px){#talent-profile-module .progress-layout{flex-direction:column}}
    #talent-profile-module .progress-left{width:200px;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;text-align:center}
    #talent-profile-module .progress-chart-wrapper{width:150px;height:150px;position:relative}
    #talent-profile-module .progress-chart{width:100%;height:100%;border-radius:50%;background:conic-gradient(#22c55e var(--pct), #e5e7eb 0);display:flex;align-items:center;justify-content:center;position:relative}
    #talent-profile-module .progress-chart::before{content:"";position:absolute;inset:8px;background:#fff;border-radius:50%}
    #talent-profile-module .progress-chart-inner{position:relative;z-index:1;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
    #talent-profile-module .progress-chart-inner img{width:78px;height:78px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.12)}
    #talent-profile-module .progress-chart-inner span{font-weight:900;color:#16a34a}
    #talent-profile-module .rating-info{margin-top:12px;background:#f8fafc;border:1px solid var(--line);border-radius:12px;padding:10px 12px;font-size:12px;color:var(--muted);text-align:left;width:100%}
    #talent-profile-module .rating-info strong{color:#0f172a;display:block;margin-bottom:4px}
    #talent-profile-module .progress-right{flex:1;display:flex;flex-direction:column;gap:14px}
    #talent-profile-module .prog-item{display:flex;flex-direction:column;gap:8px}
    #talent-profile-module .prog-header{display:flex;justify-content:space-between;align-items:center;font-weight:900}
    #talent-profile-module .prog-pct{font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid var(--line);background:#f1f5f9;color:var(--muted)}
    #talent-profile-module .prog-desc{font-size:12px;color:var(--muted);line-height:1.4}
    #talent-profile-module .prog-bar-bg{height:8px;background:#e5e7eb;border-radius:999px;overflow:hidden}
    #talent-profile-module .prog-bar-fill{height:100%;width:var(--p);background:#22c55e;border-radius:999px;transition:width .3s ease}
    #talent-profile-module .prog-link{color:#2563eb;font-size:12px;font-weight:900;cursor:pointer;text-decoration:none}
    #talent-profile-module .prog-link:hover{text-decoration:underline}
    #talent-profile-module .pill-save{border:none;cursor:pointer;font-weight:900;background:#2563eb;color:#fff;padding:10px 14px;border-radius:999px}
    #talent-profile-module .pill-cancel{border:1px solid var(--line);cursor:pointer;font-weight:900;background:#fff;color:#0f172a;padding:10px 14px;border-radius:999px}
    #talent-profile-module .photoGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    @media(max-width:980px){#talent-profile-module .photoGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(max-width:520px){#talent-profile-module .photoGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    #talent-profile-module .photoTile{border:1px solid #e5e7eb;border-radius:14px;background:#fff;overflow:hidden}
    #talent-profile-module .tileHead{padding:10px 12px;font-weight:900;color:#6b7280;font-size:12px;letter-spacing:.08em;background:#f8fafc;border-bottom:1px solid #e5e7eb}
    #talent-profile-module .tileBody{position:relative;height:220px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff}
    #talent-profile-module .tileBody:hover{background:#f8fafc}
    #talent-profile-module .tileImg{width:100%;height:100%;object-fit:cover;display:none}
    #talent-profile-module .tileEmpty{width:100%;height:100%;border:1px dashed #cbd5e1;border-radius:12px;margin:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#fbfdff}
    #talent-profile-module .xPhoto{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:999px;border:none;background:rgba(255,255,255,.92);cursor:pointer;font-weight:900;color:#ef4444;display:grid;place-items:center}
    #talent-profile-module .addGrid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin-top:10px}
    @media(max-width:980px){#talent-profile-module .addGrid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:520px){#talent-profile-module .addGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    #talent-profile-module .thumb{border:1px solid #e5e7eb;border-radius:14px;background:#fff;overflow:hidden;position:relative;aspect-ratio:1}
    #talent-profile-module .thumb img{width:100%;height:100%;object-fit:cover;display:block}
    #talent-profile-module .thumb .x{position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:999px;border:none;background:rgba(255,255,255,.92);cursor:pointer;font-weight:900;color:#ef4444;display:grid;place-items:center}
    #talent-profile-module .assetsGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    @media(max-width:980px){#talent-profile-module .assetsGrid{grid-template-columns:1fr}}
    #talent-profile-module .assetBox{border:1px solid #e5e7eb;border-radius:14px;background:#fff;padding:12px}
    #talent-profile-module .assetTitle{font-weight:900;color:#6b7280;font-size:12px;letter-spacing:.08em}
    #talent-profile-module .assetRow{display:flex;gap:10px;margin-top:10px}
    #talent-profile-module .assetRow input{flex:1;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px}
    #talent-profile-module .assetList{margin-top:12px;display:grid;gap:12px}
    #talent-profile-module .assetItem{border:1px dashed #e5e7eb;border-radius:14px;padding:10px;background:#fbfdff;position:relative}
    #talent-profile-module .assetItem .x{position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:999px;border:none;background:#fff;cursor:pointer;font-weight:900;color:#ef4444}
    #talent-profile-module .ytFrame{width:100%;aspect-ratio:16/9;border:0;border-radius:10px;background:#000}
    #talent-profile-module audio{width:100%;margin-top:6px}
    #talent-profile-module .creditsList{display:grid;gap:10px;margin-top:12px}
    #talent-profile-module .creditCard{border:1px solid #e5e7eb;border-radius:14px;padding:14px;background:#fff;position:relative}
    #talent-profile-module .creditCard .x{position:absolute;top:12px;right:12px;border:none;background:transparent;cursor:pointer;font-weight:900;color:#6b7280}
    #talent-profile-module .creditCard .x:hover{color:#ef4444}
    #talent-profile-module .creditTop{display:flex;justify-content:space-between;gap:10px;padding-right:20px;align-items:baseline}
    #talent-profile-module .creditTop b{font-size:15px;color:#111827}
    #talent-profile-module .creditMeta{color:#6b7280;font-size:12px;font-weight:900;margin-top:4px}
    #talent-profile-module .creditAbout{margin-top:8px;color:#374151;font-size:13px;line-height:1.5}
    #talent-profile-module .credit-form-box{border:1px dashed var(--btn);background:#eff6ff;padding:14px;border-radius:14px;margin-top:12px}
    @media (max-width:900px){
      #talent-profile-module .grid{grid-template-columns:1fr}
      #talent-profile-module .side{order:1}
      #talent-profile-module .main{order:0}
    }
    #talent-profile-module .photoWrap{position:relative}
    #talent-profile-module .photoX{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.92);cursor:pointer;font-weight:900;color:#ef4444;display:none;place-items:center;z-index:5}
    #talent-profile-module .photoWrap.hasPhoto .photoX{display:grid}
    #talent-profile-module .photoX:hover{background:#fee2e2;border-color:#fecaca}
    @media (max-width:520px){
      #talent-profile-module .formGrid{grid-template-columns:1fr 1fr!important}
      #talent-profile-module .dd-panel.is-fixed{position:fixed!important;left:12px!important;right:12px!important;top:var(--dd-top,120px)!important;width:auto!important;max-height:min(60vh,340px);overflow:auto;z-index:200000!important}
    }
    @media (max-width:360px){ #talent-profile-module .formGrid{grid-template-columns:1fr 1fr!important;max-width:100px} }
    #talent-profile-module .dd-btn .dd-value{font-weight:800;color:#0f172a}
    #talent-profile-module .dd-btn .dd-placeholder{color:#6b7280;font-weight:800}
    #talent-profile-module .apMultiBlock{display:flex;flex-direction:column;gap:12px}
    #talent-profile-module .apMultiBlock .field{width:100%}
    #talent-profile-module #appearanceEdit .formGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    #talent-profile-module #appearanceEdit .formGrid .frow:nth-last-child(3),
    #talent-profile-module #appearanceEdit .formGrid .frow:nth-last-child(2),
    #talent-profile-module #appearanceEdit .formGrid .frow:nth-last-child(1){grid-column:1 / -1}
    
    /* MHS (Mobile Hero Slider) */
    #talent-profile-module .mhs{display:none;width:100%;position:relative;z-index:5;background:#0b1220;height:380px; border-radius: 16px; overflow:hidden; margin-bottom: 20px;}
    @media (max-width:900px){#talent-profile-module .mhs{display:block}}
    @media (max-width:520px){#talent-profile-module .mhs{height:420px}}
    #talent-profile-module .mhs-viewport{position:absolute;inset:0;overflow:hidden}
    #talent-profile-module .mhs-track{height:100%;display:flex;transition:transform 260ms ease;will-change:transform}
    #talent-profile-module .mhs-slide{flex:0 0 100%;height:100%;position:relative;background:#0b1220}
    #talent-profile-module .mhs-img{width:100%;height:100%;object-fit:cover;display:block}
    #talent-profile-module .mhs-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.30) 0%,rgba(0,0,0,.08) 45%,rgba(0,0,0,.40) 100%);pointer-events:none}
    #talent-profile-module .mhs-top{position:absolute;left:14px;right:14px;top:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;z-index:2}
    #talent-profile-module .mhs-pill{display:inline-flex;align-items:center;gap:10px;padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.92);border:1px solid rgba(255,255,255,.6);font-weight:900;color:#0f172a;line-height:1;backdrop-filter:blur(8px)}
    #talent-profile-module .mhs-topEdit{width:44px;height:44px;border-radius:999px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.92);color:#0f172a;cursor:pointer;font-weight:1000;display:grid;place-items:center;line-height:1;backdrop-filter:blur(8px)}
    #talent-profile-module .mhs-arrow{position:absolute;top:50%;transform:translateY(-50%);width:46px;height:46px;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.25);color:#fff;cursor:pointer;z-index:2;display:grid;place-items:center;font-size:20px}
    #talent-profile-module .mhs-arrow.prev{left:10px}
    #talent-profile-module .mhs-arrow.next{right:10px}
    #talent-profile-module .mhs-nameWrap{position:absolute;left:14px;right:14px;bottom:56px;z-index:2;text-align:center;color:#fff;font-weight:1000;letter-spacing:-0.02em;text-shadow:0 8px 20px rgba(0,0,0,.45)}
    #talent-profile-module .mhs-name{font-size:44px;line-height:1.02}
    @media (max-width:520px){#talent-profile-module .mhs-name{font-size:40px}}
    #talent-profile-module .mhs-dots{position:absolute;left:0;right:0;bottom:18px;display:flex;justify-content:center;gap:8px;z-index:2}
    #talent-profile-module .mhs-dot{width:10px;height:10px;border-radius:999px;border:1px solid rgba(255,255,255,.55);background:rgba(255,255,255,.25);cursor:pointer}
    #talent-profile-module .mhs-dot.active{background:rgba(255,255,255,.95);border-color:rgba(255,255,255,.95)}
    @media (min-width:901px){#talent-profile-module .mhs{display:none!important}}
    @media (max-width:900px){#talent-profile-module .topRow{display:none!important} #talent-profile-module #sidebarfoto{display:none!important}}
  </style>

  <div id="talent-profile-module">
    <div id="mhs-container-hook"></div>

    <div class="alert" id="topAlert">
      <span class="dot"></span>
      <div>
        <strong>Profil Anda tersembunyi:</strong> harap lengkapi minimal 1 foto headshot.
      </div>
    </div>

    <div class="grid">
      <aside class="card side">
        <div id="sidebarfoto">
          <h4>HEADSHOT</h4>
          <div class="ph">
            <div class="photoWrap" id="wrapHeadshot">
              <button class="photoX" type="button" data-remove-photo="headshot" title="Remove">×</button>
              <div class="avatar" id="photoHeadshot" data-photo-box="headshot" aria-label="Headshot"></div>
            </div>
            <div class="cap"><span class="linkAdd" data-upload="headshot">Upload</span><div>Min resolution: 600×800 px</div></div>
          </div>
          <div class="block"><button class="btn ghost" type="button" onclick="ProfileApp.Modals.open('modalProgress')">🔓 Unlock (My photo score)</button></div>
          <div class="block">
            <div class="miniRow">
              <div>
                <h4 style="margin:0 0 8px;">SIDE VIEW</h4>
                <div class="mini">
                  <div class="photoWrap" id="wrapSide"><button class="photoX" type="button" data-remove-photo="side" title="Remove">×</button><div class="miniBox" id="photoSide" data-photo-box="side" aria-label="Side view"></div></div>
                  <div class="cap"><span class="linkAdd" data-upload="side">Upload</span><br />Min: 600×800 px</div>
                </div>
              </div>
              <div>
                <h4 style="margin:0 0 8px;">FULL HEIGHT</h4>
                <div class="mini">
                  <div class="photoWrap" id="wrapFull"><button class="photoX" type="button" data-remove-photo="full" title="Remove">×</button><div class="miniBox" id="photoFull" data-photo-box="full" aria-label="Full height"></div></div>
                  <div class="cap"><span class="linkAdd" data-upload="full">Upload</span><br />Min: 600×800 px</div>
                </div>
              </div>
            </div>
          </div>
          <div class="block"><button class="btn ghost" type="button" onclick="loadModule('comcard_maker')">⬇️ Buat Comp Card</button></div>
        </div>

        <div class="block" id="contactsCard">
          <div class="rowHead"><h4 style="margin:0;">CONTACTS</h4><button class="miniBtn" type="button" id="btnEditContacts">Edit</button></div>
          <div class="kv" id="contactView">
            <div class="item" id="rowPhone"><span>📞</span><span id="txtPhone">-</span></div>
            <div class="item" id="rowEmail"><span>✉️</span><span id="txtEmail">-</span></div>
          </div>
        </div>

        <div class="block" id="personalLinkCard">
          <div class="rowHead"><h4 style="margin:0;">PERSONAL LINK</h4><button class="miniBtn" type="button" id="btnEditPersonalLink">Add</button></div>
          <div id="personalLinkView" class="item" style="background:#fff;"><span id="txtPersonalLink">Add your custom URL.</span></div>
          <div id="personalLinkEdit" hidden style="margin-top:10px;"><input id="inpPersonalLink" placeholder="https://yourlink.com"></div>
        </div>

        <div class="block" id="socialCard">
          <div class="rowHead"><h4 style="margin:0;">SOCIAL MEDIA</h4><button class="miniBtn" type="button" id="btnEditSocial">Add</button></div>
          <div id="socialView">
            <div class="item" style="background:#fff;" id="socialEmpty"><span>Add links to your social accounts.</span><span class="linkAdd" id="btnEditSocial2">Add</span></div>
            <div id="socialList" class="socialList" hidden></div>
          </div>
          <div id="socialEdit" hidden style="margin-top:10px;">
            <div class="formGrid">
              <div class="frow"><label>Facebook</label><input id="sm_facebook" placeholder="https://facebook.com/..."></div>
              <div class="frow"><label>Instagram</label><input id="sm_instagram" placeholder="https://instagram.com/..."></div>
              <div class="frow"><label>TikTok</label><input id="sm_tiktok" placeholder="https://tiktok.com/@..."></div>
              <div class="frow"><label>X</label><input id="sm_x" placeholder="https://x.com/..."></div>
              <div class="frow"><label>YouTube</label><input id="sm_youtube" placeholder="https://youtube.com/..."></div>
              <div class="frow"><label>Website</label><input id="sm_website" placeholder="https://..."></div>
              <div class="frow"><label>IMDb</label><input id="sm_imdb" placeholder="https://www.imdb.com/name/..."></div>
            </div>
          </div>
        </div>
      </aside>

      <main class="card main">
        <div class="topRow">
          <div class="titleWrap">
            <h1 id="headerName">Memuat...</h1>
            <div class="subMeta">
              <span class="rating"><span class="star"></span> <span id="headerRating">0</span></span>
              <span> / 10,000 (Skor Profil)</span>
            </div>
          </div>
        </div>

        <div class="tabs" role="tablist" id="tabs">
          <div class="tab active" role="tab" data-tab="info">Info</div>
          <div class="tab" role="tab" data-tab="photos">Photos</div>
          <div class="tab" role="tab" data-tab="assets">Assets</div>
          <div class="tab" role="tab" data-tab="credits">Credits</div>
        </div>

        <div class="progressWrap" id="progressWrap">
          <div class="progressHead">
            <span>Your profile progress</span>
            <button class="btn ghost" type="button" style="width:auto;" onclick="ProfileApp.Modals.open('modalProgress')">Open ▾</button>
          </div>
          <div class="bar"><div id="progressBarFill"></div></div>
          <div class="hint"><span>Dapatkan skor profil penuh agar lebih mudah ditemukan oleh Casting Director.</span></div>
        </div>

        <section class="panel active" id="panel-info">
          <div class="section">
            <div class="sectionHead"><div class="label">INTERESTED IN:</div></div>
            <div class="sectionBody">
              <div class="dropdown">
                <button class="dd-btn" type="button" data-dd="interestedDD">Select categories <span class="dd-caret">▾</span></button>
                <div class="dd-panel" id="interestedDD" hidden></div>
              </div>
              <div class="chips" id="interestedChips"></div>
              <div class="mutedHelp">Klik checkbox untuk menambahkan. Klik (×) pada chip untuk menghapus.</div>
            </div>
          </div>

          <div class="section">
            <div class="sectionHead"><div class="label">SKILLS:</div></div>
            <div class="sectionBody">
              <div class="skillInput"><input type="text" id="inpSkill" maxlength="25" placeholder="Write your skills (e.g., Silat, Berenang)..."><span class="cc"><span id="skillCharCount">0</span>/25</span><button type="button" class="miniBtn primary" id="btnAddSkill">Save</button></div>
              <div class="chips" id="listSkills"></div>
            </div>
          </div>

          <div class="section" id="secPersonal">
            <div class="sectionHead"><div class="label">PERSONAL:</div><div class="add" id="btnEditPersonal" style="opacity:.85;">✎</div></div>
            <div class="sectionBody" id="personalView">
              <div class="twoCol">
                <div class="field"><div class="k">Gender</div><div class="v" id="txtGender">-</div></div>
                <div class="field"><div class="k">Date Of Birth</div><div class="v" id="txtDob">-</div></div>
                <div class="field"><div class="k">Location</div><div class="v" id="txtLoc">-</div></div>
                <div class="field"><div class="k">Ethnicity</div><div class="v" id="txtEthnicity">-</div></div>
              </div>
            </div>
            <div class="sectionBody" id="personalEdit" hidden>
              <div class="formGrid">
                <div class="frow"><label>Gender</label><select id="inpGender"><option>Male</option><option>Female</option><option>Non-Binary</option><option>Other</option></select></div>
                <div class="frow"><label>Date Of Birth</label><input type="date" id="inpDob"></div>
                <div class="frow"><label>Location (City)</label><input type="text" id="inpLoc" placeholder="e.g. Jakarta"></div>
                <div class="frow"><label>Ethnicity</label><select id="inpEthnicity"><option>Asian</option><option>Black</option><option>Caucasian</option><option>Hispanic</option><option>Other</option></select></div>
              </div>
            </div>
          </div>

          <div class="section" id="secAppearance">
            <div class="sectionHead"><div class="label">APPEARANCE:</div><div class="add" id="btnEditAppearance" style="opacity:.85;">✎</div></div>
            <div class="sectionBody" id="appearanceView">
              <div class="twoCol">
                <div class="field"><div class="k">Height</div><div class="v" id="apv_height">n/a</div></div>
                <div class="field"><div class="k">Weight</div><div class="v" id="apv_weight">n/a</div></div>
                <div class="field"><div class="k">Eye Color</div><div class="v" id="apv_eye">n/a</div></div>
                <div class="field"><div class="k">Hair Color</div><div class="v" id="apv_hair">n/a</div></div>
                <div class="field"><div class="k">Hip Size</div><div class="v" id="apv_hip">n/a</div></div>
                <div class="field"><div class="k">Chest/Bust</div><div class="v" id="apv_chest">n/a</div></div>
                <div class="field"><div class="k">Body Type</div><div class="v" id="apv_bodytype">n/a</div></div>
              </div>
              <div style="height:12px"></div>
              <div class="apMultiBlock">
                <div class="field full"><div class="k">Specific Characteristics</div><div class="v" id="apv_specific">n/a</div></div>
                <div class="field full"><div class="k">Tattoos</div><div class="v" id="apv_tattoos">n/a</div></div>
                <div class="field full"><div class="k">Piercings</div><div class="v" id="apv_piercings">n/a</div></div>
              </div>
            </div>
            <div class="sectionBody" id="appearanceEdit" hidden>
              <div class="formGrid">
                <div class="frow"><label>Height</label><select id="ap_height"></select></div>
                <div class="frow"><label>Weight</label><select id="ap_weight"></select></div>
                <div class="frow"><label>Eye Color</label><select id="ap_eye"></select></div>
                <div class="frow"><label>Hair Color</label><select id="ap_hair"></select></div>
                <div class="frow"><label>Hip Size</label><select id="ap_hip"></select></div>
                <div class="frow"><label>Chest/Bust</label><select id="ap_chest"></select></div>
                <div class="frow"><label>Body Type</label><select id="ap_bodytype"></select></div>
                <div class="frow"><label>Specific Characteristics</label><div class="dropdown"><button class="dd-btn" type="button" data-dd="ap_specDD"><span class="dd-placeholder">Select</span><span class="dd-value" id="ap_specValue" hidden></span><span class="dd-caret">▾</span></button><div class="dd-panel" id="ap_specDD" hidden></div></div></div>
                <div class="frow"><label>Tattoos</label><div class="dropdown"><button class="dd-btn" type="button" data-dd="ap_tattooDD"><span class="dd-placeholder">Select</span><span class="dd-value" id="ap_tattooValue" hidden></span><span class="dd-caret">▾</span></button><div class="dd-panel" id="ap_tattooDD" hidden></div></div></div>
                <div class="frow"><label>Piercings</label><div class="dropdown"><button class="dd-btn" type="button" data-dd="ap_pierceDD"><span class="dd-placeholder">Select</span><span class="dd-value" id="ap_pierceValue" hidden></span><span class="dd-caret">▾</span></button><div class="dd-panel" id="ap_pierceDD" hidden></div></div></div>
              </div>
            </div>
          </div>
        </section>

        <section class="panel" id="panel-photos">
          <div class="section" style="border:none;margin-top:14px;">
            <div class="sectionBody">
              <div class="photoGrid">
                <div class="photoTile"><div class="tileHead" style="text-align:center;">HEADSHOT</div><div class="tileBody" data-main-photo="headshot"><img id="ph_headshot" class="tileImg" alt="Headshot"><div class="tileEmpty" id="ph_headshot_empty"><span style="color:var(--btn); font-weight:900;">Upload</span><span class="cap" style="margin:0;">Min resolution:<br>600x800 px</span></div></div></div>
                <div class="photoTile"><div class="tileHead" style="text-align:center;">SIDE VIEW</div><div class="tileBody" data-main-photo="side"><img id="ph_side" class="tileImg" alt="Side view"><div class="tileEmpty" id="ph_side_empty"><span style="color:var(--btn); font-weight:900;">Upload</span><span class="cap" style="margin:0;">Min resolution:<br>600x800 px</span></div></div></div>
                <div class="photoTile"><div class="tileHead" style="text-align:center;">FULL HEIGHT</div><div class="tileBody" data-main-photo="full"><img id="ph_full" class="tileImg" alt="Full height"><div class="tileEmpty" id="ph_full_empty"><span style="color:var(--btn); font-weight:900;">Upload</span><span class="cap" style="margin:0;">Min resolution:<br>600x800 px</span></div></div></div>
                <div class="photoTile" style="background:#f8fafc;"><div class="tileHead" style="text-align:center;border-bottom:none;"></div><div class="tileBody" style="border:none;cursor:default;flex-direction:column;gap:10px;padding:20px;"><div style="background:#0f172a;color:#fff;width:30px;height:30px;border-radius:999px;display:grid;place-items:center;">🔒</div><div style="font-weight:900;">Additional Photos</div><div class="cap" style="margin:0;">Increasing your chances to be discovered</div></div></div>
              </div>
              <div style="height:14px"></div>
              <div class="sectionHead" style="border:1px solid var(--line);border-radius:14px;"><div class="label">ADDITIONAL PHOTOS</div><button class="pill-save" type="button" id="btnAddAdditional">+ Add more</button></div>
              <div class="addGrid" id="additionalPhotosGrid"></div>
            </div>
          </div>
        </section>

        <section class="panel" id="panel-assets">
          <div class="assetsGrid" style="margin-top:14px;">
            <div class="assetBox"><div class="assetTitle">VIDEOS: <span class="cap" style="margin:0;display:inline;">(YouTube links)</span></div><div class="assetRow"><input id="inpYt" placeholder="Paste YouTube URL here..."><button class="btn ghost" type="button" onclick="ProfileApp.Assets.add('youtube')" style="width:auto;">Add</button></div><div id="listYt" class="assetList"></div></div>
            <div class="assetBox"><div class="assetTitle">AUDIO: <span class="cap" style="margin:0;display:inline;">(mp3/wav/ogg URL, or YouTube)</span></div><div class="assetRow"><input id="inpAudio" placeholder="Paste Audio URL..."><button class="btn ghost" type="button" onclick="ProfileApp.Assets.add('audio')" style="width:auto;">Add</button></div><div id="listAudio" class="assetList"></div></div>
          </div>
        </section>

        <section class="panel" id="panel-credits">
          <div class="section" style="border:none;margin-top:14px;">
            <div class="sectionHead"><div class="label">CREDITS</div><div class="add" onclick="ProfileApp.Credits.toggleForm(true)">+ Add</div></div>
            <div class="sectionBody">
              <div id="creditFormWrapper" class="credit-form-box" hidden>
                <div class="formGrid">
                  <div class="frow"><label>Job title</label><input type="text" id="cr_title" placeholder="e.g. Lead Actor" maxlength="130"><span class="cap" style="margin:0;">From 3 to 130 chars</span></div>
                  <div class="frow"><label>Date</label><div style="display:flex;gap:10px;"><select id="cr_month" style="flex:1;"><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option><option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option></select><select id="cr_year" style="flex:1;"></select></div></div>
                </div>
                <div class="frow" style="margin-top:10px;"><label>Company</label><input type="text" id="cr_company" placeholder="Production company or agency"></div>
                <div class="frow" style="margin-top:10px;"><label>About</label><textarea id="cr_about" placeholder="Describe your role..."></textarea></div>
                <div style="display:flex;gap:10px;margin-top:10px;"><button class="pill-save" type="button" onclick="ProfileApp.Credits.save()">Save Credit</button><button class="pill-cancel" type="button" onclick="ProfileApp.Credits.toggleForm(false)">Cancel</button></div>
              </div>
              <div class="empty" id="creditEmptyState" style="margin-top:12px;"><span>Please list any acting/modeling experience.</span><span class="linkAdd" onclick="ProfileApp.Credits.toggleForm(true)">Add</span></div>
              <div class="sectionHead" id="creditListHeader" hidden style="margin-top:12px;border:1px solid var(--line);border-radius:14px;"><div class="label">CREDITS LIST</div><button class="pill-save" type="button" onclick="ProfileApp.Credits.toggleForm(true)">+ Add Another</button></div>
              <div id="listCredits" class="creditsList"></div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <input type="file" id="fileInput" accept="image/png, image/jpeg, image/webp" hidden>

    <div class="modal" id="modalCrop" hidden>
      <div class="modalBackdrop" data-close="modal"></div>
      <div class="modalCard" style="max-width:720px;"><div class="modalHead"><h3>Crop Photo</h3><button class="modalClose" type="button" data-close="modal">×</button></div><div class="modalBody"><div class="crop-area" style="border:1px solid var(--line);border-radius:14px;padding:10px;background:#f8fafc;"><img id="cropTarget" src="" alt="Crop target" style="display:block;max-width:100%;"></div><div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;"><button class="miniBtn" type="button" id="btnCropCancel">Cancel</button><button class="miniBtn primary" type="button" id="btnCropApply">Apply & Save</button></div></div></div>
    </div>

    <div class="modal" id="modalProgress" hidden>
      <div class="modalBackdrop" onclick="ProfileApp.Modals.close('modalProgress')"></div>
      <div class="modalCard"><div class="modalHead"><h3>Profile Progress</h3><button class="modalClose" type="button" onclick="ProfileApp.Modals.close('modalProgress')">×</button></div><div class="modalBody"><div class="progress-layout"><div class="progress-left"><div class="progress-chart-wrapper"><div class="progress-chart" id="modalChartCircle" style="--pct: 0deg;"><div class="progress-chart-inner"><img id="modalChartAvatar" src="https://via.placeholder.com/150" alt="Avatar"><span>★ <span id="modalChartRating">0</span></span></div></div></div><div class="rating-info"><strong>💡 Tip:</strong> Lengkapi foto Anda untuk menaikkan rating!</div></div><div class="progress-right"><div class="prog-item"><div class="prog-header"><span>Info</span><span class="prog-pct" id="progPctInfo">0%</span></div><div class="prog-bar-bg"><div class="prog-bar-fill" id="progBarInfo" style="--p:0%;"></div></div></div><div class="prog-item"><div class="prog-header"><span>Photos</span><span class="prog-pct" id="progPctPhotos">0%</span></div><div class="prog-bar-bg"><div class="prog-bar-fill" id="progBarPhotos" style="--p:0%;"></div></div></div><div class="prog-item"><div class="prog-header"><span>Videos/Audio</span><span class="prog-pct" id="progPctVideos">0%</span></div><div class="prog-bar-bg"><div class="prog-bar-fill" id="progBarVideos" style="--p:0%;"></div></div></div></div></div></div></div>
    </div>

    <div class="modal" id="modalName" hidden>
      <div class="modalBackdrop" onclick="ProfileApp.Modals.close('modalName')"></div>
      <div class="modalCard" style="max-width:520px;"><div class="modalHead"><h3>Edit Name</h3><button class="modalClose" type="button" onclick="ProfileApp.Modals.close('modalName')">×</button></div><div class="modalBody"><div class="formGrid"><div class="frow"><label>First name</label><input id="nameFirst" type="text" placeholder="First name"></div><div class="frow"><label>Last name</label><input id="nameLast" type="text" placeholder="Last name"></div></div><div style="display:flex;gap:10px;margin-top:12px;"><button class="pill-save" type="button" onclick="ProfileAppName.save()">Save</button><button class="pill-cancel" type="button" onclick="ProfileApp.Modals.close('modalName')">Cancel</button></div></div></div>
    </div>
  
    <div id="floatingSaveBar" class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 flex justify-between items-center gap-4 z-[9000] transform translate-y-full transition-transform duration-300 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:ml-64">
      <div class="flex items-center gap-2 text-sm font-bold text-orange-600">
        <i class="fa-solid fa-circle-exclamation text-lg animate-pulse"></i>
        <span class="hidden sm:inline">Ada perubahan yang belum disimpan</span>
        <span class="sm:hidden">Belum disimpan</span>
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-[13px] hover:bg-gray-200 transition-colors" onclick="window.ProfileAppLogic.revert()">Batal</button>
        <button class="px-6 py-2.5 rounded-xl bg-[#7c3aed] text-white font-black text-[13px] shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2" onclick="window.ProfileAppLogic.saveToApi()" id="btnSaveApi"><i class="fa-solid fa-cloud-arrow-up"></i> Simpan</button>
      </div>
    </div>
  </div>
  `;
}

export async function initEvents() {
    // 1. Inject CropperJS Script secara dinamis jika belum ada
    if (!window.Cropper) {
        await new Promise(r => { const s = document.createElement("script"); s.src = "https://unpkg.com/cropperjs@1.6.2/dist/cropper.min.js"; s.onload = r; document.head.appendChild(s); });
    }

    // 2. Logic Internal yang Diadaptasi untuk SPA
    const qs = (id) => document.getElementById(id);
    const qsa = (sel) => Array.from(document.querySelectorAll(sel));

    const KEY = "talent_profile_fix_v2";
    const DEFAULT = {
        name: { first: "Memuat", last: "..." },
        contacts: { phone: "", email: "" },
        personal: { gender: "Male", dob: "", loc: "", ethnicity: "Other" },
        personalLink: "", interestedIn: [], skills: [],
        social: { facebook: "", instagram: "", tiktok: "", x: "", youtube: "", website: "", imdb: "", vimeo: "", linkedin: "", flickr: "", sagaftra: "" },
        photos: { headshot: "", side: "", full: "", additional: [] },
        appearance: { height: "N/A", weight: "N/A", eye: "N/A", hair: "N/A", hip: "N/A", chest: "N/A", bodytype: "N/A", specific: [], tattoos: [], piercings: [] },
        assets: { youtube: [], audio: [] }, credits: []
    };

    let state = JSON.parse(JSON.stringify(DEFAULT));

    // INTEGRASI API - Fungsi Load
    
    let originalState = {};
    let isDirty = false;

    function checkDirty() {
        if(JSON.stringify(originalState) !== JSON.stringify(state)) {
            isDirty = true;
            document.getElementById('floatingSaveBar')?.classList.remove('translate-y-full');
        } else {
            isDirty = false;
            document.getElementById('floatingSaveBar')?.classList.add('translate-y-full');
        }
    }

    // Fungsi Load dari API
    async function load() {
        try {
            // Ambil dari /me untuk basic info
            const resAuth = await fetch('/api/auth/me').then(r => r.json());
            if (resAuth.ok && resAuth.user) {
                const parts = resAuth.user.full_name.split(" ");
                state.name.first = parts[0];
                state.name.last = parts.slice(1).join(" ") || "";
                state.contacts.email = resAuth.user.email;
            }
            
            // Ambil dari Database via API
            const resDb = await fetch('/api/talent/profile_get').then(r => r.json());
            if (resDb.ok && resDb.profile) {
                state = { ...state, ...resDb.profile, name: state.name, contacts: { ...resDb.profile.contacts, email: state.contacts.email } };
            } else {
                // Fallback LocalStorage jika DB kosong
                const raw = localStorage.getItem(KEY);
                if (raw) state = { ...state, ...JSON.parse(raw), name: state.name };
            }
            
            originalState = JSON.parse(JSON.stringify(state)); // Simpan state awal
        } catch (e) {}
    }

    // Modifikasi save() agar memicu checkDirty
    // UTILS
    function setMode(sectionId, mode) { const el = qs(sectionId); if (el) el.dataset.mode = mode; }
    function getMode(sectionId) { const el = qs(sectionId); return el?.dataset?.mode || "view"; }

    // INITIALIZERS
    function initTabs() {
        const tabs = qs("tabs");
        if (!tabs) return;
        tabs.addEventListener("click", (e) => {
            const tab = e.target.closest?.(".tab[data-tab]");
            if (!tab) return;
            const key = tab.getAttribute("data-tab");
            qsa(".tab").forEach(t => t.classList.toggle("active", t === tab));
            qsa(".panel").forEach(p => p.classList.remove("active"));
            qs("panel-" + key)?.classList.add("active");
        });
    }

    function initModals() {
        window.ProfileApp = window.ProfileApp || {};
        ProfileApp.Modals = ProfileApp.Modals || {
            open(id) { const m = qs(id); if (m) { m.hidden = false; document.documentElement.style.overflow = "hidden"; if (id === "modalProgress") window.ProfileProgress.update(); } },
            close(id) { const m = qs(id); if (m) { m.hidden = true; document.documentElement.style.overflow = ""; } }
        };
    }

    function applyHeader() {
        const full = `${state.name.first} ${state.name.last}`.trim();
        const h1 = qs("headerName");
        if (h1) h1.innerHTML = full;
    }
    
    window.ProfileAppName = {
        save() {
            state.name.first = (qs("nameFirst").value || "").trim();
            state.name.last = (qs("nameLast").value || "").trim();
            save(); applyHeader(); ProfileApp.Modals.close("modalName");
        }
    };

    function renderContacts() { qs("txtPhone").textContent = state.contacts.phone || "-"; qs("txtEmail").textContent = state.contacts.email || "-"; }

    function renderPersonal() {
        qs("txtGender").textContent = state.personal.gender || "—";
        qs("txtDob").textContent = state.personal.dob || "—";
        qs("txtLoc").textContent = state.personal.loc || "—";
        qs("txtEthnicity").textContent = state.personal.ethnicity || "—";
    }

    function initPersonal() {
        const btn = qs("btnEditPersonal");
        if (!btn) return;
        setMode("secPersonal", "view");
        btn.style.cursor = "pointer";
        btn.textContent = "✎";
        btn.addEventListener("click", () => {
            const mode = getMode("secPersonal");
            if (mode === "view") {
                qs("personalView").hidden = true; qs("personalEdit").hidden = false;
                qs("inpGender").value = state.personal.gender || "Male";
                qs("inpDob").value = state.personal.dob || "";
                qs("inpLoc").value = state.personal.loc || "";
                qs("inpEthnicity").value = state.personal.ethnicity || "Other";
                setMode("secPersonal", "edit"); btn.textContent = "Save";
            } else {
                state.personal.gender = qs("inpGender").value;
                state.personal.dob = qs("inpDob").value;
                state.personal.loc = qs("inpLoc").value;
                state.personal.ethnicity = qs("inpEthnicity").value;
                save(); renderPersonal();
                qs("personalView").hidden = false; qs("personalEdit").hidden = true;
                setMode("secPersonal", "view"); btn.textContent = "✎";
            }
        });
    }

    // PHOTO HANDLING & CROPPER
    let cropper = null;
    let currentTarget = "headshot";
    function destroyCropper(){ try{ if(cropper) cropper.destroy(); }catch{} cropper=null; }
    
    function renderSidebarPhotos(){
        const map={headshot:qs("photoHeadshot"), side:qs("photoSide"), full:qs("photoFull")};
        const wrapMap={headshot:qs("wrapHeadshot"), side:qs("wrapSide"), full:qs("wrapFull")};
        ["headshot","side","full"].forEach((k)=> {
            const box = map[k]; const wrap = wrapMap[k]; const url = state.photos?.[k] || "";
            if(!box) return;
            box.style.backgroundImage = url ? `url("${url}")` : "";
            box.classList.toggle("hasPhoto", !!url);
            if(wrap) wrap.classList.toggle("hasPhoto", !!url);
        });
    }
    
    function renderPhotosPanel(){
        const setImg = (id, eId, url) => { const img=qs(id), emp=qs(eId); if(img&&emp) { if(url){img.src=url; img.style.display="block"; emp.style.display="none";}else{img.style.display="none"; emp.style.display="flex";} }};
        setImg("ph_headshot","ph_headshot_empty", state.photos.headshot);
        setImg("ph_side","ph_side_empty", state.photos.side);
        setImg("ph_full","ph_full_empty", state.photos.full);
    }
    
    function openCropModal(dataUrl){
        const img=qs("cropTarget");
        if(!img) return;
        img.onload=()=>{ ProfileApp.Modals.open("modalCrop"); destroyCropper(); cropper=new Cropper(img,{aspectRatio:3/4,viewMode:1,background:false,autoCropArea:1}); };
        img.src=dataUrl;
    }
    
    function initPhotoBindings(){
        window.ProfileUpload = window.ProfileUpload || {};
        window.ProfileUpload.open = (target)=>{ currentTarget=target; qs("fileInput").click(); };
        qs("fileInput")?.addEventListener("change", async ()=>{
            const file = qs("fileInput").files[0];
            if(!file) return;
            const r=new FileReader();
            r.onload=()=> openCropModal(r.result);
            r.readAsDataURL(file);
            qs("fileInput").value="";
        });
        qs("btnCropCancel")?.addEventListener("click",()=>{ destroyCropper(); ProfileApp.Modals.close("modalCrop"); });
        qs("btnCropApply")?.addEventListener("click",()=>{
            if(!cropper) return;
            const canvas=cropper.getCroppedCanvas({maxWidth:900,maxHeight:1200,imageSmoothingQuality:"high"});
            state.photos[currentTarget]=canvas.toDataURL("image/jpeg",0.88);
            save(); destroyCropper(); ProfileApp.Modals.close("modalCrop"); 
            renderSidebarPhotos(); renderPhotosPanel();
        });
    }

    // PROGRESS BAR LOGIC
    window.ProfileProgress = {
        update(){
            const fill=qs("progressBarFill");
            let score = 0;
            if(state.contacts.email) score += 20;
            if(state.personal.gender) score += 20;
            if(state.photos.headshot) score += 40;
            if(state.photos.full) score += 20;
            
            const totalPct = Math.min(100, score);
            if(fill) fill.style.width = totalPct+"%";
            
            if(qs("headerRating")) qs("headerRating").textContent = (totalPct * 100).toLocaleString();
            if(qs("topAlert")) qs("topAlert").style.display = state.photos.headshot ? "none" : "flex";
            
            // Update Modal Progress
            if(qs("progPctInfo")) qs("progPctInfo").textContent = (state.contacts.email ? "100%" : "50%");
            if(qs("progBarInfo")) qs("progBarInfo").style.setProperty("--p", (state.contacts.email ? "100%" : "50%"));
            if(qs("progPctPhotos")) qs("progPctPhotos").textContent = state.photos.headshot ? "100%" : "0%";
            if(qs("progBarPhotos")) qs("progBarPhotos").style.setProperty("--p", state.photos.headshot ? "100%" : "0%");
        }
    };

    // EXECUTE ALL
    async function boot() {
        await load();
        initTabs();
        initModals();
        applyHeader();
        renderContacts();
        renderPersonal();
        initPersonal();
        initPhotoBindings();
        renderSidebarPhotos();
        renderPhotosPanel();
        window.ProfileProgress.update();
        
        // MHS Logic (Mobile Hero Slider)
        const MHS = document.createElement('div');
        MHS.className = 'mhs mb-6 mt-2';
        MHS.innerHTML = `<div class="mhs-viewport"><div class="mhs-track"><div class="mhs-slide"><img src="${state.photos.headshot || 'https://via.placeholder.com/800x1200?text=Upload+Headshot'}" class="mhs-img"></div></div><div class="mhs-overlay"></div><div class="mhs-nameWrap"><div class="mhs-name">${state.name.first}</div></div></div>`;
        document.getElementById('mhs-container-hook').appendChild(MHS);
    }
    
    boot();
}
