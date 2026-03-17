import { renderLayout } from "/assets/js/ui.js";
import { apiGet } from "/assets/js/api.js";

export default async function(){

  renderLayout("Profile", `<div id="profile">Loading...</div>`);

  const res = await apiGet("/functions/api/talent/profile_get");

  const el = document.getElementById("profile");

  if(!res.ok){
    el.textContent = "Failed load";
    return;
  }

  el.innerHTML = `<pre>${JSON.stringify(res.data, null, 2)}</pre>`;
}
