export function saveDeckToHistory(topic, cards, currentHistory = null) {
  const history = currentHistory ? [...currentHistory] : JSON.parse(localStorage.getItem('langdeck_history') || '[]');
  const newDeck = { 
    id: Date.now().toString(), 
    topic, 
    cards, 
    date: new Date().toISOString() 
  };
  history.unshift(newDeck);
  localStorage.setItem('langdeck_history', JSON.stringify(history));
  return history;
}

export function getDeckHistory() {
  return JSON.parse(localStorage.getItem('langdeck_history') || '[]');
}

export function deleteDeckFromHistory(id, currentHistory = null) {
  const history = currentHistory ? [...currentHistory] : getDeckHistory();
  const newHistory = history.filter(deck => deck.id !== id);
  localStorage.setItem('langdeck_history', JSON.stringify(newHistory));
  return newHistory;
}
