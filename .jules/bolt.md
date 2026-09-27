## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.
## 2026-09-26 - Extreme High-Frequency Text Updates Pattern
**Learning:** For extreme high-frequency text updates (like AI text streaming), relying on React's `useState` can cause UI lag and high CPU usage due to the sheer volume of renders.
**Action:** Bypass React's render cycle by using direct DOM manipulation (e.g., `textContainerRef.current.appendChild(document.createTextNode(chunk))`) via refs. Manually manage visibility of placeholders to prevent regressions.
## 2026-09-27 - DOM Node Concatenation over Appending
**Learning:** When bypassing React and using direct DOM mutation for AI text streams, calling `document.createTextNode(chunk)` and appending it for every chunk creates thousands of individual text nodes in the DOM tree. This can lead to excessive memory allocation and layout thrashing, slowing down the UI over time.
**Action:** When streaming text directly to the DOM, concatenate chunks to the `nodeValue` of the container's `lastChild` (if it's a TextNode) rather than appending new nodes for each chunk. This keeps the DOM flat (1 node instead of 1000+).
