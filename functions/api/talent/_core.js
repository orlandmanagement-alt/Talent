import { jsonInvalid, jsonUnauthorized, jsonForbidden } from "../../_core/response.js";
import { requireSession } from "../../_core/auth.js";

export function nowTs(){
  return Math.floor(Date.now() / 1000);
}

export function makeId(prefix){
  return `${prefix}_${crypto.randomUUID()}`;
}

export function norm(value){
  return String(value || "").trim();
}

export function sanitizeSlug(value){
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseJsonSafe(text, fallback = []){
  try{
    return JSON.parse(String(text || ""));
  }catch{
    return fallback;
  }
}

export async function requireTalentSession(env, request){
  const auth = await requireSession(env, request);
  if(!auth.ok){
    return {
      ok: false,
      res: jsonUnauthorized("session_not_found")
    };
  }

  const roles = Array.isArray(auth.roles) ? auth.roles : [];
  const allowed = roles.includes("talent") || roles.includes("super_admin") || roles.includes("admin");

  if(!allowed){
    return {
      ok: false,
      res: jsonForbidden("talent_role_required")
    };
  }

  return {
    ok: true,
    auth
  };
}

export async function ensureTalentProfileBundle(env, user){
  const now = nowTs();
  const userId = String(user.id || "").trim();
  const displayName = norm(user.display_name || user.email || user.phone || "Talent");
  const baseSlug = sanitizeSlug(displayName || userId || "talent");

  let profile = await env.DB.prepare(`
    SELECT *
    FROM talent_profiles
    WHERE user_id = ?
    LIMIT 1
  `).bind(userId).first();

  if(!profile){
    let slug = baseSlug || `talent-${userId.slice(-6)}`;
    let seq = 1;
    while(true){
      const exists = await env.DB.prepare(`
        SELECT id
        FROM talent_profiles
        WHERE public_slug = ?
        LIMIT 1
      `).bind(slug).first();
      if(!exists) break;
      seq += 1;
      slug = `${baseSlug}-${seq}`;
    }

    await env.DB.prepare(`
      INSERT INTO talent_profiles (
        id,
        user_id,
        display_name,
        public_slug,
        gender,
        dob,
        location,
        bio,
        visibility_status,
        visibility_reason,
        phone_verified,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, '', '', '', '', 'hidden', 'profile_incomplete', 0, ?, ?)
    `).bind(
      makeId("talp"),
      userId,
      displayName,
      slug,
      now,
      now
    ).run();

    profile = await env.DB.prepare(`
      SELECT *
      FROM talent_profiles
      WHERE user_id = ?
      LIMIT 1
    `).bind(userId).first();
  }

  let contact = await env.DB.prepare(`
    SELECT *
    FROM talent_contact_public
    WHERE user_id = ?
    LIMIT 1
  `).bind(userId).first();

  if(!contact){
    await env.DB.prepare(`
      INSERT INTO talent_contact_public (
        id,
        user_id,
        email,
        phone,
        website,
        contact_visibility,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, '', 'private', ?, ?)
    `).bind(
      makeId("tcp"),
      userId,
      user.email || "",
      "",
      now,
      now
    ).run();

    contact = await env.DB.prepare(`
      SELECT *
      FROM talent_contact_public
      WHERE user_id = ?
      LIMIT 1
    `).bind(userId).first();
  }

  let appearance = await env.DB.prepare(`
    SELECT *
    FROM talent_appearance
    WHERE user_id = ?
    LIMIT 1
  `).bind(userId).first();

  if(!appearance){
    await env.DB.prepare(`
      INSERT INTO talent_appearance (
        id,
        user_id,
        height,
        weight,
        eye_color,
        hair_color,
        body_type,
        chest,
        hip,
        tattoos,
        piercings,
        characteristics,
        created_at,
        updated_at
      ) VALUES (?, ?, '', '', '', '', '', '', '', '', '', '', ?, ?)
    `).bind(
      makeId("tap"),
      userId,
      now,
      now
    ).run();

    appearance = await env.DB.prepare(`
      SELECT *
      FROM talent_appearance
      WHERE user_id = ?
      LIMIT 1
    `).bind(userId).first();
  }

  let social = await env.DB.prepare(`
    SELECT *
    FROM talent_social_links
    WHERE user_id = ?
    LIMIT 1
  `).bind(userId).first();

  if(!social){
    await env.DB.prepare(`
      INSERT INTO talent_social_links (
        id,
        user_id,
        instagram,
        tiktok,
        youtube,
        website,
        x,
        facebook,
        linkedin,
        imdb,
        created_at,
        updated_at
      ) VALUES (?, ?, '', '', '', '', '', '', '', '', ?, ?)
    `).bind(
      makeId("tsl"),
      userId,
      now,
      now
    ).run();

    social = await env.DB.prepare(`
      SELECT *
      FROM talent_social_links
      WHERE user_id = ?
      LIMIT 1
    `).bind(userId).first();
  }

  return {
    profile,
    contact,
    appearance,
    social
  };
}

export async function getTalentInterests(env, userId){
  const rows = await env.DB.prepare(`
    SELECT interest
    FROM talent_interests
    WHERE user_id = ?
    ORDER BY interest ASC, created_at ASC
  `).bind(userId).all();

  return (rows.results || []).map(x => String(x.interest || "")).filter(Boolean);
}

export async function getTalentSkills(env, userId){
  const rows = await env.DB.prepare(`
    SELECT skill
    FROM talent_skills
    WHERE user_id = ?
    ORDER BY skill ASC, created_at ASC
  `).bind(userId).all();

  return (rows.results || []).map(x => String(x.skill || "")).filter(Boolean);
}

export function calcTalentProgress(bundle){
  const checks = [
    !!norm(bundle?.profile?.display_name),
    !!norm(bundle?.profile?.public_slug),
    !!norm(bundle?.profile?.gender),
    !!norm(bundle?.profile?.dob),
    !!norm(bundle?.profile?.location),
    !!norm(bundle?.contact?.email),
    !!(bundle?.interests || []).length,
    !!(bundle?.skills || []).length,
    !!norm(bundle?.appearance?.height),
    !!norm(bundle?.appearance?.eye_color),
    !!(
      norm(bundle?.social?.instagram) ||
      norm(bundle?.social?.tiktok) ||
      norm(bundle?.social?.youtube) ||
      norm(bundle?.social?.website)
    )
  ];

  const complete = checks.filter(Boolean).length;
  const total = checks.length;
  const completionPercent = Math.round((complete / total) * 100);

  let visibilityStatus = "hidden";
  let visibilityReason = "profile_incomplete";

  if(
    norm(bundle?.profile?.display_name) &&
    norm(bundle?.profile?.public_slug) &&
    norm(bundle?.profile?.gender) &&
    norm(bundle?.profile?.dob) &&
    norm(bundle?.profile?.location) &&
    (bundle?.interests || []).length &&
    (bundle?.skills || []).length
  ){
    visibilityStatus = "visible";
    visibilityReason = "ready";
  }

  return {
    completion_percent: completionPercent,
    visibility_status: visibilityStatus,
    visibility_reason: visibilityReason,
    phone_verified: Number(bundle?.profile?.phone_verified || 0) === 1
  };
}

export async function syncTalentVisibility(env, userId, bundle){
  const progress = calcTalentProgress(bundle);
  await env.DB.prepare(`
    UPDATE talent_profiles
    SET
      visibility_status = ?,
      visibility_reason = ?,
      updated_at = ?
    WHERE user_id = ?
  `).bind(
    progress.visibility_status,
    progress.visibility_reason,
    nowTs(),
    userId
  ).run();

  return progress;
}
