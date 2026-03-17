import { bootTalent } from "../assets/js/talent_boot.js";
import { talentGet, talentPost } from "../assets/js/talent_api.js";
import { showTalentNotice } from "../assets/js/talent_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setInfo(message){
  const el = getEl("talentApplicationInfo");
  if(el) el.textContent = message || "";
}

async function withdrawApplication(id){
  setInfo("Withdrawing application...");
  const res = await talentPost("/api/talent/application_withdraw", {
    application_id: id
  });

  if(!res.ok){
    setInfo(res?.data?.message || "Failed to withdraw application.");
    showTalentNotice(res?.data?.message || "Failed to withdraw application.", "error");
    return;
  }

  showTalentNotice("Application withdrawn.", "success");
  setInfo("Application withdrawn.");
  await loadApplications();
}

function renderItems(items){
  const list = getEl("talentApplicationList");
  if(!list) return;

  list.innerHTML = "";
  const rows = Array.isArray(items) ? items : [];

  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No applications found.";
    list.appendChild(li);
    return;
  }

  rows.forEach(item => {
    const li = document.createElement("li");
    const title = item.project_title || item.title || "Untitled Project";
    const meta = [
      item.role_title || item.role_name || "",
      item.status || "",
      item.created_at ? `created_at=${item.created_at}` : ""
    ].filter(Boolean).join(" • ");

    li.innerHTML = `<div><strong>${title}</strong></div><div>${meta || "-"}</div>`;

    if(item.id && !["withdrawn", "accepted", "rejected"].includes(String(item.status || "").toLowerCase())){
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Withdraw";
      btn.addEventListener("click", () => withdrawApplication(item.id));
      li.appendChild(btn);
    }

    list.appendChild(li);
  });
}

async function loadApplications(){
  setInfo("Loading applications...");
  const res = await talentGet("/api/talent/my_applications");

  if(!res.ok){
    setInfo("Failed to load applications.");
    renderItems([]);
    showTalentNotice(res?.data?.message || "Failed to load applications.", "error");
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} application(s).`);
  renderItems(rows);
}

export default async function(){
  const user = await bootTalent();
  if(!user) return;
  await loadApplications();
}
