import { jsonOk } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle
} from "./_core.js";

export async function onRequestGet({ request, env }){
  const gate = await requireTalentSession(env, request);
  if(!gate.ok) return gate.res;

  const bundle = await ensureTalentProfileBundle(env, gate.auth.user);

  return jsonOk({
    height: bundle.appearance.height || "",
    weight: bundle.appearance.weight || "",
    eye_color: bundle.appearance.eye_color || "",
    hair_color: bundle.appearance.hair_color || "",
    body_type: bundle.appearance.body_type || "",
    chest: bundle.appearance.chest || "",
    hip: bundle.appearance.hip || "",
    tattoos: bundle.appearance.tattoos || "",
    piercings: bundle.appearance.piercings || "",
    characteristics: bundle.appearance.characteristics || ""
  });
}
