import { jsonOk, jsonInvalid } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  norm,
  nowTs
} from "./_core.js";

function isEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function normalizePhone(value){
  return String(value || "").replace(/[^\d]/g, "").trim();
}

function isUrl(value){
  if(!value) return true;
  try{
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  }catch{
    return false;
  }
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

  const email = norm(body?.email ?? bundle.contact.email);
  const phone = normalizePhone(body?.phone ?? bundle.contact.phone);
  const website = norm(body?.website ?? bundle.contact.website);
  const visibility = norm(body?.contact_visibility ?? bundle.contact.contact_visibility) || "private";

  if(email && !isEmail(email)){
    return jsonInvalid("invalid_email");
  }

  if(website && !isUrl(website)){
    return jsonInvalid("invalid_website");
  }

  if(!["private","public","limited"].includes(visibility)){
    return jsonInvalid("invalid_contact_visibility");
  }

  await env.DB.prepare(`
    UPDATE talent_contact_public
    SET
      email = ?,
      phone = ?,
      website = ?,
      contact_visibility = ?,
      updated_at = ?
    WHERE user_id = ?
  `).bind(
    email,
    phone,
    website,
    visibility,
    nowTs(),
    userId
  ).run();

  return jsonOk({
    updated: true
  });
}
