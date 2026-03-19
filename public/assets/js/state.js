export const state = {
  user: null,
  portal: location.hostname.includes("client") ? "client" : "talent"
};
