## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.
## 2026-09-26 - Extreme High-Frequency Text Updates Pattern
**Learning:** For extreme high-frequency text updates (like AI text streaming), relying on React's `useState` can cause UI lag and high CPU usage due to the sheer volume of renders.
**Action:** Bypass React's render cycle by using direct DOM manipulation (e.g., `textContainerRef.current.appendChild(document.createTextNode(chunk))`) via refs. Manually manage visibility of placeholders to prevent regressions.
## 2024-11-06 - Stream Text Node Optimization
**Learning:** Even when bypassing React's render loop for text streams, creating a new `TextNode` for every incoming text chunk can cause severe DOM bloat, high memory consumption, and layout thrashing.
**Action:** Instead of `appendChild(document.createTextNode(chunk))`, concatenate the new chunk to the `nodeValue` of the container's `lastChild` (if it is a TextNode) to keep the DOM node count to a minimum.
