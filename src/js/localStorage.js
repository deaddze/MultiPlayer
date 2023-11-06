function saveProgress(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function loadProgress(key) {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : 0;
}

export { saveProgress, loadProgress };