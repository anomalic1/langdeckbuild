## 2024-05-24 - Streaming Re-renders
**Learning:** When using AI streaming (like generating flashcards token by token), the continuous `setState` calls in the parent component (`App.jsx`) cause all child components to re-render constantly. In React, this means the `Sidebar`, `DeckGeneratorForm`, and `SettingsModal` are being re-rendered hundreds of times per second unnecessarily while waiting for generation.
**Action:** Always wrap heavy child components in `React.memo` and pass stable functions with `useCallback` when they are siblings of a component that handles high-frequency state updates like a stream reader.

## 2023-10-27 - [SSE Stream Buffer and State Update Batching]
**Learning:** Parsing Server-Sent Events (SSE) stream chunks by simply splitting by `\n` without a buffer causes partial data at network chunk boundaries to be silently dropped, potentially corrupting JSON. Also, calling state update callbacks (`onChunk`) inside the inner parsing loop (once per valid SSE line) triggers excessive React state updates (O(N) per chunk instead of O(1)).
**Action:** Always maintain a string buffer when manually decoding streaming text chunks, using `lines.pop()` to retain the incomplete trailing segment. Batch state-updating callbacks so they fire at most once per network chunk rather than for every parsed SSE event.

## 2024-05-24 - [Lazy State Initialization for localStorage]
**Learning:** Initializing state with default values and then using a `useEffect` to read from `localStorage` and `setState` on mount causes a double-render cycle and can lead to flashes of empty or incorrect state.
**Action:** Always use React's lazy state initialization feature (passing a function to `useState(() => ...)`) to read from synchronous storage like `localStorage` directly during the initial render. This avoids the secondary render and improves initial load performance.
