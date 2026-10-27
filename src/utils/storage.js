export function saveDeckToHistory(topic, cards) {
  const history = getDeckHistory();
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

export function deleteDeckFromHistory(id) {
  const history = getDeckHistory();
  const newHistory = history.filter(deck => deck.id !== id);
  localStorage.setItem('langdeck_history', JSON.stringify(newHistory));
  return newHistory;
}
