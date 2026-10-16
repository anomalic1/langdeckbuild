import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ card }) {
  // ⚡ Bolt Optimization: Removed anti-pattern useEffect that synced `isFlipped` state
  // on `card` prop change. This eliminates a forced secondary React render pass.
  // We now rely on the parent providing a unique `key` to reset component state.
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full h-full perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl backface-hidden flex flex-col items-center justify-center p-8 text-center transition-all group-hover:border-blue-500/50 group-hover:shadow-[0_0_40px_rgba(37,99,235,0.15)]">
          <h3 className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">{card.target_word}</h3>
          <p className="text-2xl text-blue-400 font-semibold tracking-wide">{card.pronunciation}</p>
          <div className="absolute bottom-8 text-xs font-bold text-slate-500 group-hover:text-blue-500 transition-colors tracking-widest uppercase opacity-70 group-hover:opacity-100">
            Tap to flip
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 bg-slate-800 border border-slate-700/50 rounded-3xl shadow-2xl backface-hidden rotate-y-180 flex flex-col p-8 overflow-y-auto custom-scrollbar">
          <h3 className="text-3xl font-black text-white mb-6 border-b border-slate-700 pb-5 text-center drop-shadow-md">
            {card.native_translation}
          </h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/30">
              <p className="text-xs text-blue-400 uppercase font-black tracking-widest mb-2">Target Context</p>
              <p className="text-lg leading-relaxed font-medium text-slate-200">{card.context_sentence_target}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/30">
              <p className="text-xs text-indigo-400 uppercase font-black tracking-widest mb-2">Native Context</p>
              <p className="text-lg leading-relaxed text-slate-300">{card.context_sentence_native}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
