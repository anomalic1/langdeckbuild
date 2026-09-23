## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.

## 2026-09-23 - Bypassing React for High-Frequency Streaming
**Learning:** Even when isolating high-frequency state updates to a leaf node component (like `StreamTerminal`), using React `useState` to append character-by-character AI streams still triggers excessive re-renders, causing high CPU usage and UI lag.
**Action:** For extreme high-frequency text updates (like AI text streaming), bypass React rendering entirely. Use direct DOM mutation (e.g., `textContainerRef.current.appendChild(document.createTextNode(chunk))`) via `useRef` and `useImperativeHandle` to append text chunks without triggering the React render lifecycle.
