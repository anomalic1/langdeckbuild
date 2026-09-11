import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ⚡ Bolt Optimization: Memoized to prevent expensive re-renders while AI stream updates App state.
// Impact: Reduces re-renders significantly during deck generation.
const SettingsModal = React.memo(function SettingsModal({ isOpen, onClose, onSave }) {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1/chat/completions');
  const [modelName, setModelName] = useState('gpt-4o-mini');

  useEffect(() => {
    const savedKey = localStorage.getItem('langdeck_api_key') || '';
    const savedUrl = localStorage.getItem('langdeck_base_url') || 'https://api.openai.com/v1/chat/completions';
    const savedModel = localStorage.getItem('langdeck_model') || 'gpt-4o-mini';
    setApiKey(savedKey);
    setBaseUrl(savedUrl);
    setModelName(savedModel);
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('langdeck_api_key', apiKey);
    localStorage.setItem('langdeck_base_url', baseUrl);
    localStorage.setItem('langdeck_model', modelName);
    onSave({ apiKey, baseUrl, modelName });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">API Key</label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-shadow"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Base URL</label>
                <input 
                  type="text" 
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-shadow"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Model Name</label>
                <input 
                  type="text" 
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-shadow"
                />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 transition-colors mt-8 shadow-lg shadow-blue-900/30"
              >
                Save Settings
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default SettingsModal;
