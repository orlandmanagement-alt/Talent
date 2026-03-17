import { bootTalent } from "../../js/talent_boot.js";
import { talentGet } from "../../js/talent_api.js";
import { showTalentNotice } from "../../js/talent_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setInfo(message){
  const el = getEl("talentBookingInfo");
  if(el) el.textContent = message || "";
}

function renderItems(items){
  const list = getEl("talentBookingList");
  if(!list) return;

  list.innerHTML = "";
  const rows = Array.isArray(items) ? items : [];

  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No bookings found.";
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
    list.appendChild(li);
  });
}

export default async function(){
  const user = await bootTalent();
  if(!user) return;

  setInfo("Loading bookings...");
  const res = await talentGet("/functions/api/talent/my_bookings");

  if(!res.ok){
    setInfo("Failed to load bookings.");
    renderItems([]);
    showTalentNotice(res?.data?.message || "Failed to load bookings.", "error");
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} booking(s).`);
  renderItems(rows);
}
