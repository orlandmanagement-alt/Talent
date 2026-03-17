import { bootTalent } from "../assets/js/talent_boot.js";

export default async function(){
  const user = await bootTalent();
  if(!user) return;

  const statusEl = document.getElementById("talentStatus");
  if(statusEl){
    statusEl.textContent = "Session active";
  }
}
