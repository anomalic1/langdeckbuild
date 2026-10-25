import React, { useState, useEffect, useCallback, useRef } from 'react';
import SettingsModal from './components/SettingsModal';
import DeckGeneratorForm from './components/DeckGeneratorForm';
import Sidebar from './components/Sidebar';
import StreamTerminal from './components/StreamTerminal';
import { generateDeckStream } from './utils/api';
import { saveDeckToHistory, getDeckHistory, deleteDeckFromHistory } from './utils/storage';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// ⚡ Bolt Optimization: Lazily load FlashcardViewer to reduce initial bundle size.
// Impact: Improves Time to Interactive (TTI) by code-splitting the viewer and its dependencies (e.g., react-swipeable).
const FlashcardViewer = React.lazy(() => import('./components/FlashcardViewer'));

export default function App() {
  const [settings, setSettings] = useState(() => {
    return {
      apiKey: localStorage.getItem('langdeck_api_key') || '',
      baseUrl: localStorage.getItem('langdeck_base_url') || 'https://api.openai.com/v1/chat/completions',
      modelName: localStorage.getItem('langdeck_model') || 'gpt-4o-mini'
    };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    return !settings.apiKey;
  });
  
  const [history, setHistory] = useState(() => getDeckHistory());
  const [currentDeck, setCurrentDeck] = useState(null);
  // ⚡ Bolt Optimization: Removed redundant `currentTopic` state.
  // Impact: Deriving `topic` directly from `currentDeck.topic` avoids synchronizing multiple
  // state variables, reducing React batching overhead and eliminating potential desync bugs.
  
  const [isLoading, setIsLoading] = useState(false);

  const streamTerminalRef = useRef(null);
  const currentDeckRef = useRef(currentDeck);
  const historyRef = useRef(history);

  useEffect(() => {
    currentDeckRef.current = currentDeck;
  }, [currentDeck]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // ⚡ Bolt Optimization: Stabilized callbacks to prevent unnecessary re-renders
  // of memoized child components (Sidebar, DeckGeneratorForm) during high-frequency
  // state updates from the AI stream reader.
  const handleSaveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    toast.success('Settings saved successfully!');
  }, []);

  const handleGenerateDeck = useCallback(async (params) => {
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
      toast.error("Please configure your API key first.");
      return;
    }

    setIsLoading(true);
    streamTerminalRef.current?.clearText();
    setCurrentDeck(null);
    
    const loadingToast = toast.loading('Generating your custom deck...');
    
    try {
      const cards = await generateDeckStream(settings, params, (full, chunk) => {
        streamTerminalRef.current?.updateText(full, chunk);
      });
      
      const newHistory = saveDeckToHistory(params.nicheTopic, cards, historyRef.current);
      setHistory(newHistory);
      setCurrentDeck({ ...newHistory[0] });
      
      toast.success('Deck generated successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message || 'Failed to generate deck', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const handleSelectDeck = useCallback((deck) => {
    setCurrentDeck(deck);
  }, []);

  const handleDeleteDeck = useCallback((id) => {
    setHistory(deleteDeckFromHistory(id, historyRef.current));
    if (currentDeckRef.current?.id === id) {
      setCurrentDeck(null);
    }
    toast('Deck deleted.', { icon: '🗑️' });
  }, []);

  // ⚡ Bolt Optimization: Replaced inline arrow functions in JSX with stable
  // references to maintain React.memo effectiveness on child components.
  const handleNewDeck = useCallback(() => setCurrentDeck(null), []);
  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      <Toaster position="top-right" />
      
      <Sidebar 
        history={history}
        currentDeckId={currentDeck?.id}
        onSelectDeck={handleSelectDeck}
        onDeleteDeck={handleDeleteDeck}
        onNewDeck={handleNewDeck}
        onOpenSettings={handleOpenSettings}
      />

      <main className="flex-1 overflow-y-auto relative p-8">
        <AnimatePresence mode="wait">
          {!currentDeck ? (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
            >
              <div className="flex flex-col justify-center">
                <DeckGeneratorForm 
                  onGenerate={handleGenerateDeck} 
                  isLoading={isLoading} 
                />
              </div>
              
              <div className="flex flex-col h-full py-8">
                <StreamTerminal ref={streamTerminalRef} isLoading={isLoading} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-center"
            >
              <React.Suspense fallback={<div className="animate-pulse flex flex-col items-center justify-center text-slate-500"><div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>Loading...</div>}>
                <FlashcardViewer
                  deck={currentDeck.cards}
                  topic={currentDeck.topic}
                  onBack={() => setCurrentDeck(null)}
                />
              </React.Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
        settings={settings}
      />
    </div>
  );
}
