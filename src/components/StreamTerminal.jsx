import React, { useImperativeHandle, forwardRef, useRef } from 'react';

// ⚡ Bolt Optimization: Extracted terminal into a child component and used useImperativeHandle
// to manage streaming text state. This isolates high-frequency state updates to this leaf node,
// preventing expensive re-renders of the entire App component tree on every single stream chunk.
// ⚡ Bolt Optimization: Direct DOM mutation bypasses React rendering lifecycle for extreme high-frequency
// text streaming updates, significantly reducing UI lag and high CPU usage.
const StreamTerminal = forwardRef(({ isLoading }, ref) => {
  const containerRef = useRef(null);
  const isFirstChunkRef = useRef(true);

  useImperativeHandle(ref, () => ({
    updateText: (full, chunk) => {
      if (isFirstChunkRef.current) {
        if (containerRef.current) containerRef.current.innerHTML = '';
        isFirstChunkRef.current = false;
      }
      if (containerRef.current && chunk) {
        containerRef.current.appendChild(document.createTextNode(chunk));
        // Auto-scroll to bottom on new chunk
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    },
    clearText: () => {
      isFirstChunkRef.current = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = '<span class="text-slate-600">Waiting for generation to start...</span>';
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
      <div ref={containerRef} className="flex-1 overflow-y-auto text-green-400 whitespace-pre-wrap">
        <span className="text-slate-600">Waiting for generation to start...</span>
      </div>
    </div>
  );
});

export default StreamTerminal;
