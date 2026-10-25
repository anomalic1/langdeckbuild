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
## 2023-10-13 - [Prevent O(N) List Re-renders]
**Learning:** Passing a global ID string (e.g., `currentDeckId`) into memoized child list items causes all items to re-render when the ID changes, breaking the benefits of `React.memo` (O(N) rendering).
**Action:** Always pass a derived boolean flag (e.g., `isCurrent={currentDeckId === item.id}`) instead. This ensures only the two affected list items (the previously selected and newly selected) re-render, optimizing performance to O(1).
## 2024-10-16 - Prevent Redundant Synchronous Disk Reads
**Learning:** Performing a synchronous `JSON.parse(localStorage.getItem(...))` on the main thread during high-frequency interactions (like creating/deleting decks) causes unnecessary performance overhead, especially when the same state is already maintained in React.
**Action:** Pass the already-maintained React global state down to storage utilities to compute the next state. Use a stable `useRef` to track state to allow using it inside stable callbacks without breaking memoization.
## 2024-10-16 - Eliminate useEffect Prop-Sync Double Renders
**Learning:** Using `useEffect` to manually sync local state (like `isFlipped`) when a prop (like `card`) changes is an anti-pattern that forces a secondary React render pass, degrading performance.
**Action:** Remove the syncing `useEffect` entirely. Instead, leverage React's reconciliation engine by passing a unique `key` prop tied to the data's identity from the parent (e.g., `<Flashcard key={card.id} card={card} />`). This naturally resets the component state without extra renders.
## 2026-10-18 - Avoid Redundant Derived State
**Learning:** Storing derived data (like `currentTopic` derived from `currentDeck.topic`) in its own state variable is an anti-pattern. It requires manually keeping the states in sync, increasing React batching overhead and the risk of de-synchronization bugs.
**Action:** Remove redundant state variables and derive the needed value dynamically during render (e.g., `currentDeck.topic`).
## 2025-10-21 - Code Splitting Conditionally Rendered Heavy Components
**Learning:** Initial bundle sizes can be bloated by components that aren't immediately visible, like a viewer that only appears after an action is taken.
**Action:** Use `React.lazy()` and `<Suspense>` to code-split conditionally rendered heavy components (like those with large dependencies) to reduce the initial JS bundle size and improve Time to Interactive (TTI).
## 2026-10-25 - Redundant Synchronous Disk Reads on Mount
**Learning:** Performing multiple `localStorage.getItem` reads inside child component state initializations (like `SettingsModal`) that run synchronously on mount can cause unnecessary main-thread blocking, especially if the parent component is already reading the same data.
**Action:** Lift the storage reads to the parent, initialize the state there, and pass the required configuration values down to child components as props to eliminate duplicate disk access.
