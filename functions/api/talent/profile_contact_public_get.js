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
    email: bundle.contact.email || "",
    phone: bundle.contact.phone || "",
    website: bundle.contact.website || "",
    contact_visibility: bundle.contact.contact_visibility || "private"
  });
}
