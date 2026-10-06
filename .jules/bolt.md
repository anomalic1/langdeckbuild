## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.
## 2026-09-26 - Extreme High-Frequency Text Updates Pattern
**Learning:** For extreme high-frequency text updates (like AI text streaming), relying on React's `useState` can cause UI lag and high CPU usage due to the sheer volume of renders.
**Action:** Bypass React's render cycle by using direct DOM manipulation (e.g., `textContainerRef.current.appendChild(document.createTextNode(chunk))`) via refs. Manually manage visibility of placeholders to prevent regressions.
## 2026-10-06 - Avoiding DOM Bloat in Stream Manipulation
**Learning:** Even when bypassing React for direct DOM manipulation to handle high-frequency AI text streaming, appending individual `TextNode`s for each chunk can cause excessive DOM bloat and layout thrashing.
**Action:** When streaming text into a container via refs, concatenate chunks to the `nodeValue` of the container's `lastChild` (if it is a `TextNode`) rather than instantiating a new `TextNode` for every incoming chunk.
