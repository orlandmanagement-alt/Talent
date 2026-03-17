import { jsonOk } from "../../_core/response.js";
import {
  requireTalentSession,
  ensureTalentProfileBundle,
  getTalentInterests,
  getTalentSkills,
  calcTalentProgress,
  syncTalentVisibility
} from "./_core.js";

export async function onRequestGet({ request, env }){
  const gate = await requireTalentSession(env, request);
  if(!gate.ok) return gate.res;

  const user = gate.auth.user;
  const userId = user.id;

  const base = await ensureTalentProfileBundle(env, user);
  const interests = await getTalentInterests(env, userId);
  const skills = await getTalentSkills(env, userId);

  const bundle = {
    ...base,
    interests,
    skills
  };

  const progress = calcTalentProgress(bundle);
  await syncTalentVisibility(env, userId, bundle);

  return jsonOk({
    completion_percent: progress.completion_percent,
    visibility_status: progress.visibility_status,
    visibility_reason: progress.visibility_reason,
    phone_verified: progress.phone_verified,
    invite_count: 0,
    application_count: 0,
    booking_count: 0,
    recent_invites: [],
    recent_applications: []
  });
}
