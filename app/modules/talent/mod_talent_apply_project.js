import { bootTalent } from "../../js/talent_boot.js";
import { talentPost } from "../../js/talent_api.js";
import { showTalentNotice } from "../../js/talent_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function getQuery(name){
  return new URL(location.href).searchParams.get(name) || "";
}

function setInfo(message){
  const el = getEl("talentApplyInfo");
  if(el) el.textContent = message || "";
}

export default async function(){
  const user = await bootTalent();
  if(!user) return;

  const roleFromQuery = String(getQuery("project_role_id") || "").trim();
  if(roleFromQuery && getEl("talentApplyRoleId")){
    getEl("talentApplyRoleId").value = roleFromQuery;
  }

  getEl("talentApplyForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const projectRoleId = String(getEl("talentApplyRoleId")?.value || "").trim();
    const message = String(getEl("talentApplyMessage")?.value || "").trim();

    if(!projectRoleId){
      setInfo("Project role id is required.");
      return;
    }

    setInfo("Submitting application...");
    const res = await talentPost("/functions/api/talent/project_apply", {
      project_role_id: projectRoleId,
      message
    });

    if(!res.ok){
      setInfo(res?.data?.message || "Failed to submit application.");
      showTalentNotice(res?.data?.message || "Failed to submit application.", "error");
      return;
    }

    showTalentNotice("Application submitted successfully.", "success");
    setInfo("Application submitted successfully.");
  });
}
