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
    instagram: bundle.social.instagram || "",
    tiktok: bundle.social.tiktok || "",
    youtube: bundle.social.youtube || "",
    website: bundle.social.website || "",
    x: bundle.social.x || "",
    facebook: bundle.social.facebook || "",
    linkedin: bundle.social.linkedin || "",
    imdb: bundle.social.imdb || ""
  });
}
