let timer = null;
let isPolling = false;
let currentFn = null;
let currentMs = 30000;

export function startPolling(fn, ms = 30000) {
  stopPolling();
  currentFn = fn;
  currentMs = ms;
  isPolling = true;
  
  // Eksekusi pertama kali langsung
  Promise.resolve().then(fn).catch(() => {});
  
  timer = setInterval(() => {
    // Hanya lakukan fetch jika Tab Browser sedang aktif dilihat (menghemat kuota & baterai)
    if (document.visibilityState === 'visible') {
      Promise.resolve().then(fn).catch(() => {});
    }
  }, ms);
}

export function stopPolling() {
  isPolling = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// Auto stop/start saat user pindah tab aplikasi lain
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === 'visible' && isPolling && currentFn) {
      Promise.resolve().then(currentFn).catch(() => {});
  }
});
