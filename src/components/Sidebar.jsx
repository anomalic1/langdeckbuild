import React from 'react';
import { BookOpen, Settings, Clock, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

// ⚡ Bolt Optimization: Memoized to prevent expensive re-renders while AI stream updates App state.
// Impact: Reduces re-renders significantly during deck generation.
const Sidebar = React.memo(function Sidebar({ history, onSelectDeck, onDeleteDeck, onNewDeck, onOpenSettings, currentDeckId }) {
  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-300">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <BookOpen className="text-blue-500" size={28} />
        <h1 className="text-xl font-bold tracking-tight text-white">LangDeck</h1>
      </div>

      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewDeck}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} className="mr-2" /> New Deck
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center">
          <Clock size={14} className="mr-2" /> Recent Sessions
        </div>
        
        {history.length === 0 ? (
          <p className="text-sm text-slate-600 px-2 italic">No decks generated yet.</p>
        ) : (
          history.map((deck) => (
            <div 
              key={deck.id}
              onClick={() => onSelectDeck(deck)}
              className={`group flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                currentDeckId === deck.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50'
              }`}
            >
              <div className="flex flex-col truncate pr-2">
                <span className="font-medium text-sm truncate">{deck.topic}</span>
                <span className="text-xs text-slate-500">{deck.cards.length} cards • {new Date(deck.date).toLocaleDateString()}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDeck(deck.id);
                }}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Settings size={18} className="mr-3" /> Settings
        </button>
      </div>
    </div>
  );
});

export default Sidebar;
