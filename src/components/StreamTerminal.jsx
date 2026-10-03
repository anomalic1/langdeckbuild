import React, { useImperativeHandle, forwardRef, useRef } from 'react';

// ⚡ Bolt Optimization: Replaced useState with direct DOM manipulation via refs.
// This bypasses React's render cycle for extreme high-frequency text updates
// (AI streaming), avoiding UI lag and high CPU usage.
const StreamTerminal = forwardRef(({ isLoading }, ref) => {
  const textContainerRef = useRef(null);
  const placeholderRef = useRef(null);

  useImperativeHandle(ref, () => ({
    updateText: (fullText, chunk) => {
      if (placeholderRef.current && placeholderRef.current.style.display !== 'none') {
        placeholderRef.current.style.display = 'none';
      }
      if (textContainerRef.current && chunk) {
        // ⚡ Bolt Optimization: Concatenate text directly to nodeValue of the existing TextNode
        // rather than appending thousands of individual TextNodes during AI streaming.
        // Impact: Eliminates severe DOM bloat and prevents layout thrashing, keeping memory footprint low.
        const container = textContainerRef.current;
        const lastChild = container.lastChild;
        if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
          lastChild.nodeValue += chunk;
        } else {
          container.appendChild(document.createTextNode(chunk));
        }
      }
    },
    clearText: () => {
      if (textContainerRef.current) {
        textContainerRef.current.textContent = '';
      }
      if (placeholderRef.current) {
        placeholderRef.current.style.display = 'block';
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
      <div className="flex-1 overflow-y-auto text-green-400 whitespace-pre-wrap relative">
        <div ref={placeholderRef} className="absolute inset-0 pointer-events-none">
          <span className="text-slate-600">Waiting for generation to start...</span>
        </div>
        <div ref={textContainerRef} className="w-full h-full"></div>
      </div>
    </div>
  );
});

export default StreamTerminal;
