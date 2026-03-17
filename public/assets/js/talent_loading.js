const TALENT_LOADING_CLASS = "is-loading";

export function setTalentLoading(target, loading = true){
  const el = typeof target === "string"
    ? document.getElementById(target)
    : target;

  if(!el) return;

  if(loading){
    el.dataset.loading = "1";
    el.classList.add(TALENT_LOADING_CLASS);
    if("disabled" in el) el.disabled = true;
    return;
  }

  delete el.dataset.loading;
  el.classList.remove(TALENT_LOADING_CLASS);
  if("disabled" in el) el.disabled = false;
}

export async function withTalentLoading(target, fn){
  setTalentLoading(target, true);
  try{
    return await fn();
  } finally {
    setTalentLoading(target, false);
  }
}
