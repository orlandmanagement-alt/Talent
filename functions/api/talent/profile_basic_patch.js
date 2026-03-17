import { jsonOk, jsonInvalid, jsonConflict } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  norm,
  sanitizeSlug,
  nowTs
} from "./_core.js";

function validDate(value){
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "").trim());
}

export async function onRequestPatch({ request, env }){
  const gate = await requireTalentSession(env, request);
  if(!gate.ok) return gate.res;

  let body;
  try{
    body = await request.json();
  }catch{
    return jsonInvalid("invalid_json");
  }

  const user = gate.auth.user;
  const userId = user.id;

  const bundle = await ensureTalentProfileBundle(env, user);

  const displayName = norm(body?.display_name || bundle.profile.display_name);
  const gender = norm(body?.gender || bundle.profile.gender);
  const dob = norm(body?.dob || bundle.profile.dob);
  const location = norm(body?.location || bundle.profile.location);
  const bio = norm(body?.bio || bundle.profile.bio);
  const rawSlug = body?.public_slug === undefined ? bundle.profile.public_slug : body?.public_slug;
  const publicSlug = sanitizeSlug(rawSlug);

  if(!displayName){
    return jsonInvalid("display_name_required");
  }

  if(dob && !validDate(dob)){
    return jsonInvalid("invalid_dob");
  }

  if(rawSlug !== undefined && !publicSlug){
    return jsonInvalid("invalid_public_slug");
  }

  if(publicSlug){
    const exists = await env.DB.prepare(`
      SELECT id
      FROM talent_profiles
      WHERE public_slug = ?
        AND user_id <> ?
      LIMIT 1
    `).bind(publicSlug, userId).first();

    if(exists){
      return jsonConflict("public_slug_taken");
    }
  }

  await env.DB.prepare(`
    UPDATE talent_profiles
    SET
      display_name = ?,
      public_slug = ?,
      gender = ?,
      dob = ?,
      location = ?,
      bio = ?,
      updated_at = ?
    WHERE user_id = ?
  `).bind(
    displayName,
    publicSlug,
    gender,
    dob,
    location,
    bio,
    nowTs(),
    userId
  ).run();

  return jsonOk({
    updated: true
  });
}
