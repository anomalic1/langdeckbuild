import React, { useState } from 'react';
import Flashcard from './Flashcard';
import { ArrowLeft, ArrowRight, Shuffle, Download, ArrowLeftCircle } from 'lucide-react';
import { exportToAnki } from '../utils/ankiExport';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function FlashcardViewer({ deck, topic, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDeck, setCurrentDeck] = useState(deck);
  const [direction, setDirection] = useState(0);

  if (!currentDeck || currentDeck.length === 0) return null;

  const nextCard = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % currentDeck.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + currentDeck.length) % currentDeck.length);
  };

  const shuffleDeck = () => {
    const shuffled = [...currentDeck].sort(() => Math.random() - 0.5);
    setCurrentDeck(shuffled);
    setCurrentIndex(0);
    toast('Deck Shuffled!', { icon: '🔀', style: { background: '#1e293b', color: '#fff' } });
  };

  // ⚡ Bolt Optimization: Dynamically import canvas-confetti only when needed
  // Impact: Reduces initial JS bundle size by code-splitting the ~30KB confetti library
  const handleExport = async () => {
    exportToAnki(currentDeck, topic);

    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
      });
    } catch (err) {
      console.warn("Could not load confetti animation");
    }

    toast.success('Exported to Anki successfully!', { style: { background: '#1e293b', color: '#fff' } });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextCard(),
    onSwipedRight: () => prevCard(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false
  });

  return (
    <div className="max-w-2xl w-full mx-auto" {...handlers}>
      <div className="flex justify-between items-center mb-10">
        <motion.button 
          whileHover={{ x: -4 }}
          onClick={onBack}
          className="text-slate-400 hover:text-white flex items-center transition-colors font-semibold"
        >
          <ArrowLeftCircle className="mr-2" size={24} />
          Go Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center transition-colors shadow-lg shadow-green-900/20"
        >
          <Download className="mr-2" size={18} />
          Export to Anki
        </motion.button>
      </div>

      <div className="mb-8 text-center">
        <span className="bg-slate-800 border border-slate-700 text-blue-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-sm">
          {topic}
        </span>
      </div>

      <div className="relative h-96 w-full overflow-visible">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Flashcard card={currentDeck[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center justify-between px-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevCard}
          className="p-4 rounded-full bg-slate-800 text-slate-300 shadow-xl border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
          aria-label="Previous card"
        >
          <ArrowLeft size={24} />
        </motion.button>

        <div className="text-slate-500 font-bold tracking-widest text-sm">
          <span className="text-white text-lg">{currentIndex + 1}</span> / {currentDeck.length}
        </div>

        <div className="flex space-x-5">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={shuffleDeck}
            className="p-4 rounded-full bg-slate-800 text-slate-300 shadow-xl border border-slate-700 hover:bg-slate-700 hover:text-purple-400 transition-all"
            title="Shuffle Deck"
          >
            <Shuffle size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextCard}
            className="p-4 rounded-full bg-slate-800 text-slate-300 shadow-xl border border-slate-700 hover:bg-slate-700 hover:text-blue-400 transition-all"
            aria-label="Next card"
          >
            <ArrowRight size={24} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
