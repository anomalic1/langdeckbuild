## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.
## 2026-09-26 - Extreme High-Frequency Text Updates Pattern
**Learning:** For extreme high-frequency text updates (like AI text streaming), relying on React's `useState` can cause UI lag and high CPU usage due to the sheer volume of renders.
**Action:** Bypass React's render cycle by using direct DOM manipulation (e.g., `textContainerRef.current.appendChild(document.createTextNode(chunk))`) via refs. Manually manage visibility of placeholders to prevent regressions.
## 2024-10-09 - High-Frequency DOM Text Node Append Bloat
**Learning:** During extreme high-frequency text streaming (like AI responses), appending a new `document.createTextNode(chunk)` for every single small chunk causes massive DOM bloat and layout thrashing, leading to memory issues and sluggishness even when bypassing React renders.
**Action:** Always check the `lastChild` of the container. If it's a `TEXT_NODE` (nodeType 3), concatenate the incoming string chunk directly to its `nodeValue` rather than continually spawning thousands of separate text nodes in the DOM.
