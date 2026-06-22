# writefwd design-sync notes

- **Target project:** `writefwd` (Claude Design), id `d93bdbc1-bebb-4497-bf12-cca13293c58a`.
- **Shape: knowledge-base (hand-authored), not a compiled bundle.** This repo is
  intentionally build-less plain HTML/CSS/JS, and this environment has **no node/npm**,
  so the standard /design-sync converter (esbuild → `_ds_bundle.js`) cannot run here.
  Instead the project holds a styling knowledge base: tokens + component CSS +
  guidelines + static preview cards. Designs render on-brand by using the `.wf-*`
  classes and `var(--*)` tokens; there is no React package to import.
- **Source of truth:** `write-b/index.html` (read-only). The live site was never
  modified. To re-extract, re-read that file and regenerate `ds-bundle/`.
- **`ds-bundle/` is git-ignored** — it's a regenerable upload staging dir, the
  real artifact lives in the Claude Design project.
- **If you later add a build step:** the proper next step is a real component
  library (React/web-components) + `dist/`, then run the full /design-sync
  converter to get live, instantiable components instead of CSS-only knowledge.
