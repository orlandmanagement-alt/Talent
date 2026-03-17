import { jsonOk, jsonInvalid } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  norm,
  nowTs
} from "./_core.js";

function isUrl(value){
  if(!value) return true;
  try{
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  }catch{
    return false;
  }
}

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

  const instagram = norm(body?.instagram ?? bundle.social.instagram);
  const tiktok = norm(body?.tiktok ?? bundle.social.tiktok);
  const youtube = norm(body?.youtube ?? bundle.social.youtube);
  const website = norm(body?.website ?? bundle.social.website);
  const x = norm(body?.x ?? bundle.social.x);
  const facebook = norm(body?.facebook ?? bundle.social.facebook);
  const linkedin = norm(body?.linkedin ?? bundle.social.linkedin);
  const imdb = norm(body?.imdb ?? bundle.social.imdb);

  const urls = [instagram, tiktok, youtube, website, x, facebook, linkedin, imdb];
  if(urls.some(v => v && !isUrl(v))){
    return jsonInvalid("invalid_social_link");
  }

  await env.DB.prepare(`
    UPDATE talent_social_links
    SET
      instagram = ?,
      tiktok = ?,
      youtube = ?,
      website = ?,
      x = ?,
      facebook = ?,
      linkedin = ?,
      imdb = ?,
      updated_at = ?
    WHERE user_id = ?
  `).bind(
    instagram,
    tiktok,
    youtube,
    website,
    x,
    facebook,
    linkedin,
    imdb,
    nowTs(),
    userId
  ).run();

  return jsonOk({
    updated: true
  });
}
