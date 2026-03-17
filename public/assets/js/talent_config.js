import { TALENT_CONFIG_LOCAL } from "./talent_config.local.js";
import { TALENT_CONFIG_STAGING } from "./talent_config.staging.js";
import { TALENT_CONFIG_PROD } from "./talent_config.prod.js";

function detectTalentEnv(){
  const host = String(location.hostname || "").toLowerCase();

  if(host === "127.0.0.1" || host === "localhost"){
    return "local";
  }

  if(host.includes("staging-talent.") || host.includes("staging-")){
    return "staging";
  }

  return "production";
}

function selectTalentConfig(){
  const env = detectTalentEnv();

  if(env === "local") return TALENT_CONFIG_LOCAL;
  if(env === "staging") return TALENT_CONFIG_STAGING;
  return TALENT_CONFIG_PROD;
}

export const TALENT_CONFIG = selectTalentConfig();

export function talentApiUrl(path){
  const base = String(TALENT_CONFIG.backendBaseUrl || "").replace(/\/+$/, "");
  const clean = String(path || "").startsWith("/") ? String(path) : `/${String(path || "")}`;
  return `${base}${clean}`;
}
