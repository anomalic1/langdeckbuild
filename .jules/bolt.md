## 2024-05-17 - Lazy State Initialization for LocalStorage
**Learning:** Components that stay mounted but hidden (like AnimatePresence modals) can't just drop their resynchronization `useEffect` when moving to lazy `localStorage` initialization. If the `useEffect` is completely removed, unsaved state changes will persist when the modal is closed and reopened.
**Action:** Always combine lazy state initialization (`useState(() => ...)`) with a conditional `useEffect` (e.g., `if (isOpen) { ... }`) to ensure the state is correctly resynchronized from external storage without causing double-renders on initial mount or closure.

## 2026-09-22 - Bypassing React for Extreme High-Frequency Streaming
**Learning:** During AI text streaming, relying on React's state updates (`useState`) for every token chunk, even when isolated via `useImperativeHandle` in a leaf component, still triggers excessive Virtual DOM reconciliation. This causes measurable UI lag and high CPU usage because React was never designed for 50+ re-renders per second of long text blocks.
**Action:** When handling raw text streams (like LLM output), bypass React entirely. Use a `useRef` to target the container DOM element and directly append nodes (`document.createTextNode(chunk)`) inside `useImperativeHandle`. This maintains the clean component boundary while achieving bare-metal performance for the stream.
