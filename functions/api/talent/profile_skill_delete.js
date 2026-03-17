import { jsonOk, jsonInvalid } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  norm
} from "./_core.js";

export async function onRequestPost({ request, env }){
  const gate = await requireTalentSession(env, request);
  if(!gate.ok) return gate.res;

  let body;
  try{
    body = await request.json();
  }catch{
    return jsonInvalid("invalid_json");
  }

  const skill = norm(body?.skill).toLowerCase();
  if(!skill){
    return jsonInvalid("skill_required");
  }

  const userId = gate.auth.user.id;
  await ensureTalentProfileBundle(env, gate.auth.user);

  await env.DB.prepare(`
    DELETE FROM talent_skills
    WHERE user_id = ?
      AND skill = ?
  `).bind(userId, skill).run();

  return jsonOk({
    deleted: true,
    skill
  });
}
