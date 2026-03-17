import { jsonOk, jsonInvalid } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  norm,
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

  const userId = gate.auth.user.id;
  const bundle = await ensureTalentProfileBundle(env, gate.auth.user);

  const height = norm(body?.height ?? bundle.appearance.height);
  const weight = norm(body?.weight ?? bundle.appearance.weight);
  const eyeColor = norm(body?.eye_color ?? bundle.appearance.eye_color);
  const hairColor = norm(body?.hair_color ?? bundle.appearance.hair_color);
  const bodyType = norm(body?.body_type ?? bundle.appearance.body_type);
  const chest = norm(body?.chest ?? bundle.appearance.chest);
  const hip = norm(body?.hip ?? bundle.appearance.hip);
  const tattoos = norm(body?.tattoos ?? bundle.appearance.tattoos);
  const piercings = norm(body?.piercings ?? bundle.appearance.piercings);
  const characteristics = norm(body?.characteristics ?? bundle.appearance.characteristics);

  await env.DB.prepare(`
    UPDATE talent_appearance
    SET
      height = ?,
      weight = ?,
      eye_color = ?,
      hair_color = ?,
      body_type = ?,
      chest = ?,
      hip = ?,
      tattoos = ?,
      piercings = ?,
      characteristics = ?,
      updated_at = ?
    WHERE user_id = ?
  `).bind(
    height,
    weight,
    eyeColor,
    hairColor,
    bodyType,
    chest,
    hip,
    tattoos,
    piercings,
    characteristics,
    nowTs(),
    userId
  ).run();

  return jsonOk({
    updated: true
  });
}
