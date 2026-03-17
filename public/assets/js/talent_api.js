import { talentApiUrl } from "./talent_config.js";

async function parseJsonSafe(res){
  const text = await res.text();
  try{
    return JSON.parse(text);
  }catch{
    return {
      status: "error",
      data: {
        message: "invalid_server_response",
        raw: text
      }
    };
  }
}

async function request(method, path, body = null, extra = {}){
  const url = talentApiUrl(path);
  const headers = {
    ...(body != null ? { "content-type": "application/json" } : {}),
    ...(extra.headers || {})
  };

  const res = await fetch(url, {
    method,
    credentials: "include",
    headers,
    body: body != null ? JSON.stringify(body) : undefined
  });

  const json = await parseJsonSafe(res);

  return {
    ok: res.ok && json?.status === "ok",
    statusCode: res.status,
    status: json?.status || "error",
    data: json?.data,
    raw: json
  };
}

export async function talentGet(path){
  return request("GET", path);
}

export async function talentPost(path, body = {}){
  return request("POST", path, body);
}

export async function talentPut(path, body = {}){
  return request("PUT", path, body);
}

export async function talentPatch(path, body = {}){
  return request("PATCH", path, body);
}

export async function talentDelete(path, body = {}){
  return request("DELETE", path, body);
}
