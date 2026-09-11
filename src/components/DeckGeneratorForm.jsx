import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// ⚡ Bolt Optimization: Memoized to prevent expensive re-renders while AI stream updates App state.
// Impact: Reduces re-renders significantly during deck generation.
const DeckGeneratorForm = React.memo(function DeckGeneratorForm({ onGenerate, isLoading }) {
  const [targetLanguage, setTargetLanguage] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [nicheTopic, setNicheTopic] = useState('');
  const [numCards, setNumCards] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetLanguage || !nativeLanguage || !nicheTopic) return;
    onGenerate({ targetLanguage, nativeLanguage, nicheTopic, numCards });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-slate-800 w-full">
      <div className="flex items-center justify-center mb-8 space-x-3">
        <Sparkles className="text-blue-500" size={24} />
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Design a Deck</h2>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 tracking-wide">Target Language</label>
            <input 
              type="text" 
              required
              placeholder="e.g., French"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-600 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 tracking-wide">Native Language</label>
            <input 
              type="text" 
              required
              placeholder="e.g., English"
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-600 transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2 tracking-wide">Niche Topic</label>
          <input 
            type="text" 
            required
            placeholder="e.g., Tokyo subway navigation"
            value={nicheTopic}
            onChange={(e) => setNicheTopic(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-600 transition-all"
          />
        </div>
        
        <div className="pt-4">
          <label className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-400 tracking-wide">Number of Cards</span>
            <span className="bg-blue-500/20 text-blue-400 py-1 px-3 rounded-full text-sm font-black">{numCards}</span>
          </label>
          <input 
            type="range" 
            min="5" 
            max="20" 
            value={numCards}
            onChange={(e) => setNumCards(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-4 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all mt-8 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-3" size={24} />
              Generating Magic...
            </>
          ) : (
            'Generate Deck'
          )}
        </motion.button>
      </div>
    </form>
  );
});

export default DeckGeneratorForm;
