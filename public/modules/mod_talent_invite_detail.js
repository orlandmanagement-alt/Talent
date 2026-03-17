import { bootTalent } from "../assets/js/talent_boot.js";
import { talentGet } from "../assets/js/talent_api.js";
import { showTalentNotice } from "../assets/js/talent_notice.js";

function getEl(id){ return document.getElementById(id); }
function getQuery(name){ return new URL(location.href).searchParams.get(name) || ""; }

function setText(id, value){
  const el = getEl(id);
  if(el) el.textContent = value || "-";
}

export default async function(){
  const user = await bootTalent();
  if(!user) return;

  const inviteId = String(getQuery("invite_id") || "").trim();
  const info = getEl("talentInviteDetailInfo");

  if(!inviteId){
    if(info) info.textContent = "Invite id is missing.";
    return;
  }

  const res = await talentGet(`/api/talent/invite_detail?invite_id=${encodeURIComponent(inviteId)}`);
  if(!res.ok){
    if(info) info.textContent = "Failed to load invite detail.";
    showTalentNotice(res?.data?.message || "Failed to load invite detail.", "error");
    return;
  }

  const row = res.data || {};
  setText("idId", row.id);
  setText("idProject", row.project_title);
  setText("idRole", row.role_title || row.role_name);
  setText("idStatus", row.status);
  setText("idMessage", row.message);
  setText("idResponse", row.response_message);

  if(info) info.textContent = "Invite detail loaded.";
}
