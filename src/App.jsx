import React, { useState, useEffect, useCallback } from 'react';
import SettingsModal from './components/SettingsModal';
import DeckGeneratorForm from './components/DeckGeneratorForm';
import FlashcardViewer from './components/FlashcardViewer';
import Sidebar from './components/Sidebar';
import { generateDeckStream } from './utils/api';
import { saveDeckToHistory, getDeckHistory, deleteDeckFromHistory } from './utils/storage';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-4o-mini'
  });
  
  const [history, setHistory] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem('langdeck_api_key') || '';
    const savedUrl = localStorage.getItem('langdeck_base_url') || 'https://api.openai.com/v1/chat/completions';
    const savedModel = localStorage.getItem('langdeck_model') || 'gpt-4o-mini';
    setSettings({ apiKey: savedKey, baseUrl: savedUrl, modelName: savedModel });
    
    setHistory(getDeckHistory());
    
    if (!savedKey) setIsSettingsOpen(true);
  }, []);

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
    setStreamedText("");
    setCurrentDeck(null);
    
    const loadingToast = toast.loading('Generating your custom deck...');
    
    try {
      const cards = await generateDeckStream(settings, params, (full, chunk) => {
        setStreamedText(full);
      });
      
      const newHistory = saveDeckToHistory(params.nicheTopic, cards);
      setHistory(newHistory);
      setCurrentDeck({ ...newHistory[0] });
      setCurrentTopic(params.nicheTopic);
      
      toast.success('Deck generated successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message || 'Failed to generate deck', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  const handleSelectDeck = useCallback((deck) => {
    setCurrentDeck(deck);
    setCurrentTopic(deck.topic);
  }, []);

  const handleDeleteDeck = useCallback((id) => {
    setHistory(deleteDeckFromHistory(id));
    if (currentDeck?.id === id) {
      setCurrentDeck(null);
      setCurrentTopic("");
    }
    toast('Deck deleted.', { icon: '🗑️' });
  }, [currentDeck]);

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
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col font-mono text-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <span className="text-slate-400 font-semibold tracking-widest uppercase text-xs flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
                      AI Stream Terminal
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto text-green-400 whitespace-pre-wrap">
                    {streamedText || (
                      <span className="text-slate-600">Waiting for generation to start...</span>
                    )}
                  </div>
                </div>
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
              <FlashcardViewer 
                deck={currentDeck.cards} 
                topic={currentTopic}
                onBack={() => setCurrentDeck(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
