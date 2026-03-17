import { jsonOk } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  getTalentSkills
} from "./_core.js";

export async function onRequestGet({ request, env }){
  const gate = await requireTalentSession(env, request);
  if(!gate.ok) return gate.res;

  await ensureTalentProfileBundle(env, gate.auth.user);
  const items = await getTalentSkills(env, gate.auth.user.id);

  return jsonOk({
    items
  });
}
