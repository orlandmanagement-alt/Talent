import { TALENT_CONFIG_BASE } from "./talent_config.base.js";

export const TALENT_CONFIG_LOCAL = {
  ...TALENT_CONFIG_BASE,
  appName: "Orland Talent Local",
  portalUrl: "http://127.0.0.1:8082",
  backendBaseUrl: "http://127.0.0.1:8787",
  ssoLoginUrl: "http://127.0.0.1:8080/app/pages/sso/login.html",
  ssoDeniedUrl: "http://127.0.0.1:8080/app/pages/sso/access-denied.html",
  envName: "local"
};
