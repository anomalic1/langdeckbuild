export function saveHistory(history) {
  localStorage.setItem('langdeck_history', JSON.stringify(history));
}

export function getDeckHistory() {
  return JSON.parse(localStorage.getItem('langdeck_history') || '[]');
}
