import { bootClient } from "../../js/client_boot.js";

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
    return { status: "error", data: [] };
  }
}

function setInfo(message){
  const el = getEl("projectInfo");
  if(el) el.textContent = message || "";
}

function renderProjects(items){
  const list = getEl("projectList");
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

    const title = item.title || item.project_name || item.id || "Untitled Project";
    const meta = [
      item.status || "",
      item.project_type || "",
      item.location_text || ""
    ].filter(Boolean).join(" • ");

    li.innerHTML = `
      <div>
        <strong>${title}</strong>
      </div>
      <div>${meta || "-"}</div>
    `;

    list.appendChild(li);
  });
}

async function loadProjects(keyword = ""){
  const url = new URL("/functions/api/client/projects_get", location.origin);
  if(keyword){
    url.searchParams.set("q", keyword);
  }

  setInfo("Loading projects...");
  const res = await getJson(url.toString());

  if(res.status !== "ok"){
    setInfo("Failed to load projects.");
    renderProjects([]);
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  setInfo(`Loaded ${rows.length} project(s).`);
  renderProjects(rows);
}

export default async function(){
  const user = await bootClient();
  if(!user) return;

  getEl("projectSearchForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const keyword = String(getEl("projectSearchInput")?.value || "").trim();
    await loadProjects(keyword);
  });

  getEl("projectReloadBtn")?.addEventListener("click", async () => {
    const keyword = String(getEl("projectSearchInput")?.value || "").trim();
    await loadProjects(keyword);
  });

  await loadProjects("");
}
