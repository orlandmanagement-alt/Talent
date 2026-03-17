import { requireTalent } from "./talent_session.js";
import { TALENT_CONFIG } from "./talent_config.js";

export async function bootTalent(){
  const user = await requireTalent();
  if(!user){
    return null;
  }

  window.__TALENT_USER__ = user;
  window.__TALENT_CONFIG__ = TALENT_CONFIG;

  document.title = document.title || TALENT_CONFIG.appName;

  const nameEl = document.getElementById("talentUserName");
  if(nameEl){
    nameEl.textContent = user.display_name || user.email || user.id || "Talent";
  }

  return user;
}
