import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// ⚡ Bolt Optimization: Extracted terminal into a child component and used useImperativeHandle
// to manage streaming text state. This isolates high-frequency state updates to this leaf node,
// preventing expensive re-renders of the entire App component tree on every single stream chunk.
// ⚡ Bolt Optimization: Replaced useState with direct DOM mutations via refs for high-frequency text updates.
// Impact: Bypasses React rendering entirely during AI text streaming, preventing UI lag, high CPU usage,
// and unnecessary re-renders. Placeholders are managed manually to prevent UI regressions.
const StreamTerminal = forwardRef(({ isLoading }, ref) => {
  const containerRef = useRef(null);
  const textContentRef = useRef(null);
  const placeholderRef = useRef(null);
  const isFirstChunk = useRef(true);

  useImperativeHandle(ref, () => ({
    updateText: (fullText, chunk) => {
      if (!chunk) return;
      if (isFirstChunk.current) {
        if (placeholderRef.current) {
          placeholderRef.current.style.display = 'none';
        }
        isFirstChunk.current = false;
      }
      if (textContentRef.current) {
        textContentRef.current.appendChild(document.createTextNode(chunk));
      }
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    },
    clearText: () => {
      isFirstChunk.current = true;
      if (textContentRef.current) {
        textContentRef.current.textContent = '';
      }
      if (placeholderRef.current) {
        placeholderRef.current.style.display = 'inline';
      }
    },
  }));

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col font-mono text-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <span className="text-slate-400 font-semibold tracking-widest uppercase text-xs flex items-center">
          <div className={`w-2 h-2 rounded-full mr-3 ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
          AI Stream Terminal
        </span>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto text-green-400 whitespace-pre-wrap"
      >
        <span ref={placeholderRef} className="text-slate-600">Waiting for generation to start...</span>
        <span ref={textContentRef}></span>
      </div>
    </div>
  );
});

export default StreamTerminal;
