# reference/

The original single-file design export (`index-36.html`, kept at the repo root)
is the **source of the product/gallery/fabric images**. Those images are stored
inside it as base64 and are extracted into `public/images/` by
[`scripts/extract-images.mjs`](../scripts/extract-images.mjs), which runs
automatically before `dev` and `build`.

No base64 image blobs live in the React/TypeScript source — only in this one
reference file, which the build script reads.

### Optional: tidy the repo root

If you'd rather not keep `index-36.html` at the root, move it here:

```bash
git mv index-36.html reference/source.html
```

The extraction script looks for `reference/source.html` first, then falls back
to `index-36.html` at the root, so either layout works.
