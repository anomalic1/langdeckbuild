import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// ⚡ Bolt Optimization: Extracted terminal into a child component and used useImperativeHandle
// to manage streaming text state. This isolates high-frequency state updates to this leaf node.
// ⚡ Bolt Extreme Optimization: Bypassed React rendering entirely for text chunks.
// Uses direct DOM mutation via refs to avoid UI lag and high CPU usage during AI text streaming.
const StreamTerminal = forwardRef(({ isLoading }, ref) => {
  const textContainerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    updateText: (chunk) => {
      if (textContainerRef.current) {
        // Remove placeholder if it's the first chunk
        if (textContainerRef.current.querySelector('span')) {
           textContainerRef.current.textContent = '';
        }
        textContainerRef.current.appendChild(document.createTextNode(chunk));
      }
    },
    clearText: () => {
      if (textContainerRef.current) {
        textContainerRef.current.innerHTML = '<span class="text-slate-600">Waiting for generation to start...</span>';
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
        ref={textContainerRef}
        className="flex-1 overflow-y-auto text-green-400 whitespace-pre-wrap"
      >
        <span className="text-slate-600">Waiting for generation to start...</span>
      </div>
    </div>
  );
});

export default StreamTerminal;
