import { bootTalent } from "../assets/js/talent_boot.js";
import { talentPost } from "../assets/js/talent_api.js";
import { showTalentNotice } from "../assets/js/talent_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function getQuery(name){
  return new URL(location.href).searchParams.get(name) || "";
}

function setInfo(message){
  const el = getEl("talentInviteRespondInfo");
  if(el) el.textContent = message || "";
}

export default async function(){
  const user = await bootTalent();
  if(!user) return;

  const inviteId = String(getQuery("invite_id") || "").trim();
  if(inviteId && getEl("talentInviteId")){
    getEl("talentInviteId").value = inviteId;
  }

  getEl("talentInviteRespondForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inviteIdValue = String(getEl("talentInviteId")?.value || "").trim();
    const decision = String(getEl("talentInviteDecision")?.value || "").trim();
    const message = String(getEl("talentInviteResponseMessage")?.value || "").trim();

    if(!inviteIdValue){
      setInfo("Invite id is required.");
      return;
    }

    setInfo("Submitting response...");
    const res = await talentPost("/api/talent/invite_respond", {
      invite_id: inviteIdValue,
      decision,
      message
    });

    if(!res.ok){
      setInfo(res?.data?.message || "Failed to submit invite response.");
      showTalentNotice(res?.data?.message || "Failed to submit invite response.", "error");
      return;
    }

    showTalentNotice("Invite response submitted.", "success");
    setInfo("Invite response submitted.");
  });
}
