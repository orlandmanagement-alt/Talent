import { jsonOk, jsonInvalid, jsonConflict } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  norm,
  makeId,
  nowTs
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

  if(skill.length > 50){
    return jsonInvalid("skill_too_long");
  }

  const userId = gate.auth.user.id;
  await ensureTalentProfileBundle(env, gate.auth.user);

  const exists = await env.DB.prepare(`
    SELECT id
    FROM talent_skills
    WHERE user_id = ?
      AND skill = ?
    LIMIT 1
  `).bind(userId, skill).first();

  if(exists){
    return jsonConflict("skill_exists");
  }

  await env.DB.prepare(`
    INSERT INTO talent_skills (
      id,
      user_id,
      skill,
      created_at
    ) VALUES (?, ?, ?, ?)
  `).bind(
    makeId("tsk"),
    userId,
    skill,
    nowTs()
  ).run();

  return jsonOk({
    created: true,
    skill
  });
}
