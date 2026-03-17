import { bootTalent } from "../../js/talent_boot.js";
import { talentGet } from "../../js/talent_api.js";
import { withTalentLoading } from "../../js/talent_loading.js";
import { showTalentNotice } from "../../js/talent_notice.js";

function getEl(id){
  return document.getElementById(id);
}

function setInfo(message){
  const el = getEl("talentProjectInfo");
  if(el) el.textContent = message || "";
}

function renderProjects(items){
  const list = getEl("talentProjectList");
  if(!list) return;

  list.innerHTML = "";

  const rows = Array.isArray(items) ? items : [];
  if(!rows.length){
    const li = document.createElement("li");
    li.textContent = "No projects found.";
    list.appendChild(li);
    return;
  }

  rows.forEach(item => {
    const li = document.createElement("li");
    const title = item.title || item.project_title || item.id || "Untitled Project";
    const meta = [
      item.project_type || "",
      item.location_text || "",
      item.status || ""
    ].filter(Boolean).join(" • ");

    li.innerHTML = `
      <div><strong>${title}</strong></div>
      <div>${meta || "-"}</div>
    `;

    list.appendChild(li);
  });
}

async function loadProjects(keyword = ""){
  const path = keyword
    ? `/functions/api/talent/projects_list?q=${encodeURIComponent(keyword)}`
    : "/functions/api/talent/projects_list";

  setInfo("Loading projects...");

  const res = await talentGet(path);

  if(!res.ok){
    setInfo("Failed to load projects.");
    renderProjects([]);
    showTalentNotice(res?.data?.message || "Failed to load projects.", "error");
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} project(s).`);
  renderProjects(rows);
}

export default async function(){
  const user = await bootTalent();
  if(!user) return;

  getEl("talentProjectSearchForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const keyword = String(getEl("talentProjectSearchInput")?.value || "").trim();
    await withTalentLoading("talentProjectReloadBtn", async () => {
      await loadProjects(keyword);
    });
  });

  getEl("talentProjectReloadBtn")?.addEventListener("click", async () => {
    const keyword = String(getEl("talentProjectSearchInput")?.value || "").trim();
    await withTalentLoading("talentProjectReloadBtn", async () => {
      await loadProjects(keyword);
    });
  });

  await loadProjects("");
}
