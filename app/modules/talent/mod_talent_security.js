function getEl(id){
  return document.getElementById(id);
}

async function getJson(url){
  const res = await fetch(url, {
    method: "GET",
    credentials: "include"
  });

  const text = await res.text();
  try{
    return JSON.parse(text);
  }catch{
    return {
      status: "error",
      data: {
        message: "invalid_server_response"
      }
    };
  }
}

function renderPhoneBox(data){
  const box = getEl("phoneVerificationBox");
  if(!box) return;

  const verified = Boolean(data?.phone_verified);
  box.innerHTML = `
    <div class="talent-item-title">${verified ? "Phone Verified" : "Phone Not Verified"}</div>
    <div class="talent-item-meta">${verified ? "Your phone number is verified and can be used for secure login flows." : "Please complete phone verification to improve account trust and visibility rules."}</div>
    <div class="talent-badge">${verified ? "Verified" : "Pending"}</div>
  `;
}

function renderSessions(items){
  const box = getEl("sessionList");
  if(!box) return;

  if(!Array.isArray(items) || !items.length){
    box.innerHTML = `
      <div class="talent-item">
        <div class="talent-item-title">No active sessions found</div>
        <div class="talent-item-meta">Your device sessions will appear here.</div>
      </div>
    `;
    return;
  }

  box.innerHTML = items.map(item => `
    <div class="talent-item">
      <div class="talent-item-title">${item.device_info || "Unknown Device"}</div>
      <div class="talent-item-meta">
        IP: ${item.ip_address || "-"}<br>
        Status: ${item.status || "-"}<br>
        Expires: ${item.expires_at || "-"}
      </div>
      <div class="talent-badge">${item.status || "active"}</div>
    </div>
  `).join("");
}

async function init(){
  const me = await getJson("/functions/api/auth/me");
  if(me.status !== "ok"){
    location.href = "/app/pages/sso/login.html";
    return;
  }

  const profile = await getJson("/functions/api/talent/profile_get");
  const sessions = await getJson("/functions/api/auth/sessions");

  renderPhoneBox({
    phone_verified: Boolean(profile?.data?.visibility?.phone_verified)
  });

  renderSessions(sessions?.data?.items || []);
}

init();
