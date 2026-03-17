import { TALENT_CONFIG } from "./talent_config.js";
import { renderTalentNav } from "./talent_nav.js";
import { showTalentNotice } from "./talent_notice.js";

function ensureRoot(){
  let root = document.getElementById("talentAppShell");
  if(root) return root;

  document.body.innerHTML = `
    <div id="talentAppShell">
      <header id="talentShellHeader" style="padding:16px;border-bottom:1px solid #ddd;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;">
          <div>
            <div style="font-size:20px;font-weight:700;" id="talentShellTitle">${TALENT_CONFIG.appName}</div>
            <div style="margin-top:6px;font-size:14px;">
              Signed in as:
              <strong id="talentUserName">-</strong>
            </div>
            <div style="margin-top:6px;font-size:12px;color:#666;">
              Environment:
              <strong id="talentEnvName">${TALENT_CONFIG.envName || "unknown"}</strong>
            </div>
          </div>

          <div id="talentShellActions" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <a
              href="${TALENT_CONFIG.portalUrl || "#"}"
              style="text-decoration:none;padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;"
            >Talent Portal</a>

            <a
              href="${TALENT_CONFIG.backendBaseUrl || "#"}"
              target="_blank"
              rel="noreferrer"
              style="text-decoration:none;padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;"
            >Dashboard API</a>

            <a
              href="${TALENT_CONFIG.ssoLoginUrl || "#"}"
              style="text-decoration:none;padding:8px 10px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;"
            >SSO</a>

            <button
              id="talentLogoutBtn"
              type="button"
              style="padding:8px 10px;border:1px solid #c33;border-radius:8px;background:#fff;color:#900;cursor:pointer;"
            >Logout</button>
          </div>
        </div>

        <div id="talentShellNotice" style="display:none;margin-top:12px;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:13px;"></div>
      </header>

      <div id="talentShellNavWrap" style="padding:0 16px;"></div>
      <main id="talentShellMain" style="padding:16px;"></main>
    </div>
  `;

  return document.getElementById("talentAppShell");
}

async function runLogout(){
  const btn = document.getElementById("talentLogoutBtn");
  if(btn) btn.disabled = true;

  try{
    showTalentNotice("Signing out...", "info");

    const res = await fetch(`${String(TALENT_CONFIG.backendBaseUrl || "").replace(/\/+$/, "")}/functions/api/sso/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json"
      },
      body: "{}"
    });

    let data = null;
    try{
      data = await res.json();
    }catch{}

    if(!res.ok || data?.status !== "ok"){
      showTalentNotice((data?.data?.message || "Logout failed."), "error");
      return;
    }

    showTalentNotice("Logout successful. Redirecting to SSO login...", "success");
    setTimeout(() => {
      location.href = TALENT_CONFIG.ssoLoginUrl;
    }, 350);
  } finally {
    if(btn) btn.disabled = false;
  }
}

function bindShellActions(){
  const btn = document.getElementById("talentLogoutBtn");
  if(btn && !btn.dataset.bound){
    btn.dataset.bound = "1";
    btn.addEventListener("click", runLogout);
  }
}

export function mountTalentShell(pageTitle, contentHtml){
  ensureRoot();

  const titleEl = document.getElementById("talentShellTitle");
  if(titleEl){
    titleEl.textContent = pageTitle
      ? `${TALENT_CONFIG.appName} • ${pageTitle}`
      : TALENT_CONFIG.appName;
  }

  const envEl = document.getElementById("talentEnvName");
  if(envEl){
    envEl.textContent = TALENT_CONFIG.envName || "unknown";
  }

  const navWrap = document.getElementById("talentShellNavWrap");
  if(navWrap){
    navWrap.innerHTML = `<div id="talentPortalNav"></div>`;
    renderTalentNav();
  }

  const main = document.getElementById("talentShellMain");
  if(main){
    main.innerHTML = `
      <section>
        <h1 style="margin-top:0;">${pageTitle || TALENT_CONFIG.appName}</h1>
        ${contentHtml || ""}
      </section>
    `;
  }

  bindShellActions();
}
