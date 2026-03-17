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

  const progress = await syncTalentVisibility(env, userId, bundle);

  const profile = {
    ...base.profile,
    visibility_status: progress.visibility_status,
    visibility_reason: progress.visibility_reason
  };

  return jsonOk({
    profile: {
      id: profile.id,
      user_id: profile.user_id,
      display_name: profile.display_name || "",
      public_slug: profile.public_slug || ""
    },
    basic: {
      gender: profile.gender || "",
      dob: profile.dob || "",
      location: profile.location || "",
      bio: profile.bio || ""
    },
    contact_public: {
      email: base.contact.email || "",
      phone: base.contact.phone || "",
      website: base.contact.website || "",
      contact_visibility: base.contact.contact_visibility || "private"
    },
    interests,
    skills,
    appearance: {
      height: base.appearance.height || "",
      weight: base.appearance.weight || "",
      eye_color: base.appearance.eye_color || "",
      hair_color: base.appearance.hair_color || "",
      body_type: base.appearance.body_type || "",
      chest: base.appearance.chest || "",
      hip: base.appearance.hip || "",
      tattoos: base.appearance.tattoos || "",
      piercings: base.appearance.piercings || "",
      characteristics: base.appearance.characteristics || ""
    },
    social: {
      instagram: base.social.instagram || "",
      tiktok: base.social.tiktok || "",
      youtube: base.social.youtube || "",
      website: base.social.website || "",
      x: base.social.x || "",
      facebook: base.social.facebook || "",
      linkedin: base.social.linkedin || "",
      imdb: base.social.imdb || ""
    },
    progress,
    visibility: {
      is_visible: progress.visibility_status === "visible",
      reason: progress.visibility_reason,
      phone_verified: progress.phone_verified
    }
  });
}
