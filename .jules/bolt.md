## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.

## 2024-05-18 - Direct DOM Mutation for High-Frequency Streaming
**Learning:** Even with `useImperativeHandle` isolating state updates to a child component, high-frequency text streaming (like parsing individual characters from an AI stream) can still cause UI lag and high CPU usage if it triggers continuous React renders.
**Action:** For extreme high-frequency text updates, bypass React rendering entirely. Use `useRef` to hold a reference to the container DOM node and perform direct DOM mutation (e.g., `containerRef.current.appendChild(document.createTextNode(chunk))`). This avoids the React reconciliation cycle completely.
