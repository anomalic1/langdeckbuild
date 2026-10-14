// ⚡ Bolt Optimization: Accept currentHistory instead of forcing a synchronous,
// blocking JSON.parse(localStorage) read on every save.
export function saveDeckToHistory(topic, cards, currentHistory) {
  const newDeck = { 
    id: Date.now().toString(), 
    topic, 
    cards, 
    date: new Date().toISOString() 
  };
  // Create a new array to maintain immutability for React state
  const newHistory = [newDeck, ...(currentHistory || [])];
  localStorage.setItem('langdeck_history', JSON.stringify(newHistory));
  return newHistory;
}

export function getDeckHistory() {
  return JSON.parse(localStorage.getItem('langdeck_history') || '[]');
}

// ⚡ Bolt Optimization: Accept currentHistory instead of forcing a synchronous,
// blocking JSON.parse(localStorage) read on every delete.
export function deleteDeckFromHistory(id, currentHistory) {
  const newHistory = (currentHistory || []).filter(deck => deck.id !== id);
  localStorage.setItem('langdeck_history', JSON.stringify(newHistory));
  return newHistory;
}
