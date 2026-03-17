CREATE TABLE IF NOT EXISTS talent_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  display_name TEXT,
  public_slug TEXT,
  gender TEXT,
  dob TEXT,
  location TEXT,
  bio TEXT,
  visibility_status TEXT NOT NULL DEFAULT 'hidden',
  visibility_reason TEXT NOT NULL DEFAULT 'profile_incomplete',
  phone_verified INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS talent_contact_public (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  contact_visibility TEXT NOT NULL DEFAULT 'private',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS talent_interests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  interest TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS talent_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS talent_appearance (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  height TEXT,
  weight TEXT,
  eye_color TEXT,
  hair_color TEXT,
  body_type TEXT,
  chest TEXT,
  hip TEXT,
  tattoos TEXT,
  piercings TEXT,
  characteristics TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS talent_social_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  instagram TEXT,
  tiktok TEXT,
  youtube TEXT,
  website TEXT,
  x TEXT,
  facebook TEXT,
  linkedin TEXT,
  imdb TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uidx_talent_profiles_user_id ON talent_profiles(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_talent_profiles_slug ON talent_profiles(public_slug);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_talent_contact_public_user_id ON talent_contact_public(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_talent_appearance_user_id ON talent_appearance(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS uidx_talent_social_links_user_id ON talent_social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_talent_interests_user_id ON talent_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_talent_interests_interest ON talent_interests(interest);
CREATE INDEX IF NOT EXISTS idx_talent_skills_user_id ON talent_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_talent_skills_skill ON talent_skills(skill);
