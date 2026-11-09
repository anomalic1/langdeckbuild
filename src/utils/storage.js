export function getDeckHistory() {
  return JSON.parse(localStorage.getItem('langdeck_history') || '[]');
}
