## 2024-05-24 - Streaming Re-renders
**Learning:** When using AI streaming (like generating flashcards token by token), the continuous `setState` calls in the parent component (`App.jsx`) cause all child components to re-render constantly. In React, this means the `Sidebar`, `DeckGeneratorForm`, and `SettingsModal` are being re-rendered hundreds of times per second unnecessarily while waiting for generation.
**Action:** Always wrap heavy child components in `React.memo` and pass stable functions with `useCallback` when they are siblings of a component that handles high-frequency state updates like a stream reader.

## 2026-09-13 - Batched Streaming Updates
**Learning:** High-frequency state updates from streaming APIs (e.g., updating UI for every token chunk) can block the React main thread and cause significant UI stuttering, even if child components are memoized.
**Action:** Batch high-frequency UI updates using `requestAnimationFrame`. This caps the state updates to the display's refresh rate (typically 60FPS) and aligns them with the browser's paint cycle, keeping the application responsive during heavy streaming.
