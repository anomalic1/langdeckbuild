## 2026-10-03 - [Direct DOM Mutation Optimization]
**Learning:** For extremely high-frequency text updates (like AI text streaming), updating a single TextNode's `nodeValue` is significantly faster and more memory-efficient than repeatedly appending new `TextNode` instances to a container, which causes DOM bloat and layout thrashing.
**Action:** When manually managing text streaming via refs to bypass React's render loop, always attempt to concatenate chunks to the `nodeValue` of the container's `lastChild` (if it's a TextNode) rather than blindly appending new text nodes.
