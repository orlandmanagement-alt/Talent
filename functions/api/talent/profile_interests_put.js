import { jsonOk, jsonInvalid } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  norm,
  makeId,
  nowTs
} from "./_core.js";

export async function onRequestPut({ request, env }){
  const gate = await requireTalentSession(env, request);
  if(!gate.ok) return gate.res;

  let body;
  try{
    body = await request.json();
  }catch{
    return jsonInvalid("invalid_json");
  }

  const items = Array.isArray(body?.items) ? body.items : null;
  if(!items){
    return jsonInvalid("items_required");
  }

  const cleaned = Array.from(new Set(
    items.map(x => norm(x).toLowerCase()).filter(Boolean)
  )).slice(0, 20);

  const userId = gate.auth.user.id;
  await ensureTalentProfileBundle(env, gate.auth.user);

  await env.DB.prepare(`
    DELETE FROM talent_interests
    WHERE user_id = ?
  `).bind(userId).run();

  const now = nowTs();
  for(const interest of cleaned){
    await env.DB.prepare(`
      INSERT INTO talent_interests (
        id,
        user_id,
        interest,
        created_at
      ) VALUES (?, ?, ?, ?)
    `).bind(
      makeId("tin"),
      userId,
      interest,
      now
    ).run();
  }

  return jsonOk({
    updated: true,
    items: cleaned
  });
}
