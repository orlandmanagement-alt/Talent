import { bootTalent } from "../assets/js/talent_boot.js";
import { talentGet } from "../assets/js/talent_api.js";
import { showTalentNotice } from "../assets/js/talent_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setText(id, value){
  const el = getEl(id);
  if(el) el.textContent = value || "-";
}

function renderList(id, items){
  const list = getEl(id);
  if(!list) return;

  list.innerHTML = "";
  const rows = Array.isArray(items) ? items : [];

  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No data.";
    list.appendChild(li);
    return;
  }

  rows.forEach(item => {
    const li = document.createElement("li");
    li.textContent = String(item || "-");
    list.appendChild(li);
  });
}

export default async function(){
  const user = await bootTalent();
  if(!user) return;

  const info = getEl("profileInfo");
  if(info) info.textContent = "Loading talent profile data...";

  const res = await talentGet("/api/talent/profile_get");
  if(!res.ok){
    if(info) info.textContent = "Failed to load profile.";
    showTalentNotice(res?.data?.message || "Failed to load profile.", "error");
    return;
  }

  const data = res.data || {};

  setText("pfDisplayName", data.profile?.display_name);
  setText("pfSlug", data.profile?.public_slug);
  setText("pfGender", data.basic?.gender);
  setText("pfDob", data.basic?.dob);
  setText("pfLocation", data.basic?.location);

  setText("pfEmail", data.contact_public?.email);
  setText("pfPhone", data.contact_public?.phone);
  setText("pfWebsite", data.contact_public?.website);
  setText("pfContactVisibility", data.contact_public?.contact_visibility);

  renderList("interestList", data.interests || []);
  renderList("skillList", data.skills || []);

  setText("pfCompletion", `${Number(data.progress?.completion_percent || 0)}%`);
  setText("pfVisibilityStatus", data.progress?.visibility_status);
  setText("pfVisibilityReason", data.progress?.visibility_reason);
  setText("pfPhoneVerified", String(Boolean(data.progress?.phone_verified)));

  if(info) info.textContent = "Profile loaded.";
}
