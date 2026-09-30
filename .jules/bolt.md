## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.
## 2026-09-26 - Extreme High-Frequency Text Updates Pattern
**Learning:** For extreme high-frequency text updates (like AI text streaming), relying on React's `useState` can cause UI lag and high CPU usage due to the sheer volume of renders.
**Action:** Bypass React's render cycle by using direct DOM manipulation (e.g., `textContainerRef.current.appendChild(document.createTextNode(chunk))`) via refs. Manually manage visibility of placeholders to prevent regressions.
## 2024-10-24 - DOM Node Bloat from Direct Mutations during Streaming
**Learning:** When bypassing React rendering with direct DOM mutations (like AI text streaming), appending a new `TextNode` for every incoming chunk creates thousands of text nodes. This leads to severe DOM bloat, high memory usage, and layout thrashing.
**Action:** Instead of appending new `createTextNode` instances, append to the `nodeValue` of the container's `lastChild` if it is a `TextNode`. This keeps the DOM flat and significantly improves performance during high-frequency streaming.
