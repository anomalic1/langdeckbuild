import React, { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

// ⚡ Bolt Optimization: Extracted terminal into a child component and used useImperativeHandle
// to manage streaming text state. This isolates high-frequency state updates to this leaf node,
// preventing expensive re-renders of the entire App component tree on every single stream chunk.
// ⚡ Bolt Optimization v2: Bypassed React state completely for the streamed text.
// We now use direct DOM mutation (appendChild) to append chunks in O(1) time. This prevents
// React from having to re-render and reconcile the DOM on every single AI chunk (which happens 50-100 times per second),
// saving massive CPU overhead during generation.
const StreamTerminal = forwardRef(({ isLoading }, ref) => {
  const contentRef = useRef(null);

  useImperativeHandle(ref, () => ({
    appendChunk: (chunk) => {
      if (contentRef.current) {
        // If placeholder exists, clear it first
        if (contentRef.current.dataset.placeholder === 'true') {
          contentRef.current.textContent = '';
          contentRef.current.dataset.placeholder = 'false';
        }
        // Direct DOM manipulation bypasses React entirely
        contentRef.current.appendChild(document.createTextNode(chunk));
      }
    },
    clearText: () => {
      if (contentRef.current) {
        contentRef.current.innerHTML = '<span class="text-slate-600">Waiting for generation to start...</span>';
        contentRef.current.dataset.placeholder = 'true';
      }
    },
  }));

  // Setup initial placeholder on mount
  useEffect(() => {
    if (contentRef.current && !contentRef.current.dataset.initialized) {
      contentRef.current.innerHTML = '<span class="text-slate-600">Waiting for generation to start...</span>';
      contentRef.current.dataset.placeholder = 'true';
      contentRef.current.dataset.initialized = 'true';
    }
  }, []);

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 flex flex-col font-mono text-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <span className="text-slate-400 font-semibold tracking-widest uppercase text-xs flex items-center">
          <div className={`w-2 h-2 rounded-full mr-3 ${isLoading ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
          AI Stream Terminal
        </span>
      </div>
      {/*
        This div's children are managed entirely via the imperative handle ref to avoid
        React render cycles during high-frequency AI text streaming.
      */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto text-green-400 whitespace-pre-wrap"
      />
    </div>
  );
});

export default StreamTerminal;
