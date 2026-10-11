## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.
## 2026-09-26 - Extreme High-Frequency Text Updates Pattern
**Learning:** For extreme high-frequency text updates (like AI text streaming), relying on React's `useState` can cause UI lag and high CPU usage due to the sheer volume of renders.
**Action:** Bypass React's render cycle by using direct DOM manipulation (e.g., `textContainerRef.current.appendChild(document.createTextNode(chunk))`) via refs. Manually manage visibility of placeholders to prevent regressions.
## 2024-10-09 - High-Frequency DOM Text Node Append Bloat
**Learning:** During extreme high-frequency text streaming (like AI responses), appending a new `document.createTextNode(chunk)` for every single small chunk causes massive DOM bloat and layout thrashing, leading to memory issues and sluggishness even when bypassing React renders.
**Action:** Always check the `lastChild` of the container. If it's a `TEXT_NODE` (nodeType 3), concatenate the incoming string chunk directly to its `nodeValue` rather than continually spawning thousands of separate text nodes in the DOM.
## 2024-05-18 - Unstable Parent Callbacks and List Thrashing
**Learning:** In React, passing an unstable callback (one that depends on constantly changing parent state, like `currentDeck`) to a memoized list component (like `Sidebar`) forces the entire list and its parent to re-render, breaking memoization. Furthermore, inline operations like `new Date().toLocaleDateString()` inside an O(N) list mapping compound the performance penalty by recalculating string formats on every re-render.
**Action:** Use functional state updates or Refs to eliminate state dependencies in parent callbacks, keeping them referentially stable. Extract list items into separate memoized components (`React.memo`) and use `useMemo` for any expensive local computations (like date formatting) to isolate re-renders strictly to modified items.

## 2024-05-18 - [Reduce List Thrashing]
 **Learning:** [Passing a primitive boolean flag (like \`isCurrent\`) rather than the active item ID to memoized list items prevents O(N) list item re-renders when the selection changes. Only the previously selected and newly selected items re-render.]
 **Action:** [Always pass a boolean \`isCurrent\` or \`isSelected\` prop to \`React.memo\` list items rather than passing the globally active ID to each item.]
