# Calling Claude from HTML artifacts

```html
<script>
(async () => {
  const text = await window.claude.complete("Summarize this: ...");
})();
</script>
```

Works in hosts that wire the bridge in. In a plain browser it won't —
fall back to a fetch against a user-supplied OpenAI-compatible endpoint,
or skip the dynamic copy.
