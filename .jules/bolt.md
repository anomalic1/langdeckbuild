## 2024-05-24 - Streaming Re-renders
**Learning:** When using AI streaming (like generating flashcards token by token), the continuous `setState` calls in the parent component (`App.jsx`) cause all child components to re-render constantly. In React, this means the `Sidebar`, `DeckGeneratorForm`, and `SettingsModal` are being re-rendered hundreds of times per second unnecessarily while waiting for generation.
**Action:** Always wrap heavy child components in `React.memo` and pass stable functions with `useCallback` when they are siblings of a component that handles high-frequency state updates like a stream reader.

## 2023-10-27 - [SSE Stream Buffer and State Update Batching]
**Learning:** Parsing Server-Sent Events (SSE) stream chunks by simply splitting by `\n` without a buffer causes partial data at network chunk boundaries to be silently dropped, potentially corrupting JSON. Also, calling state update callbacks (`onChunk`) inside the inner parsing loop (once per valid SSE line) triggers excessive React state updates (O(N) per chunk instead of O(1)).
**Action:** Always maintain a string buffer when manually decoding streaming text chunks, using `lines.pop()` to retain the incomplete trailing segment. Batch state-updating callbacks so they fire at most once per network chunk rather than for every parsed SSE event.

## 2024-05-18 - Isolate high-frequency state updates
**Learning:** Frequent state updates (like AI text streaming) at the root level cause expensive re-renders across the entire React component tree, even if child components are memoized.
**Action:** Isolate high-frequency state updates into dedicated child components and use `useRef` + `useImperativeHandle` to push updates downwards without triggering a full re-render of the parent.
