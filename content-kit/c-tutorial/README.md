# Loop & Logic: C tutorial content kit

This kit is everything Codex needs to write the full C programming tutorial in a format the Loop & Logic site can import directly.

## How to use it with Codex

1. Give Codex this whole folder: upload the zip, or put it in a repository Codex can open. Codex needs Node 18+ and gcc or clang to run the checker.
2. Paste this message to start:

   > Read `CODEX_PROMPT.md` in full, then study `sample/c-tutorial/` and `spec/curriculum.json`. Write **Batch 1** (modules getting-started and basics, 18 topics) exactly as the brief says, into a new folder `c-tutorial/`. Compile and run every program, generate every `.out` file from real runs, and run `node tools/check-tutorial.mjs c-tutorial --sanitize --report c-tutorial/CHECK_REPORT.txt` until it reports 0 errors. Then zip `c-tutorial/` as `c-tutorial-v0.1.0.zip`.

3. For the next batches, say: *"Continue with Batch N, keeping all earlier topics. Bump the version to 0.N.0."*
4. Send the zip back to Claude. Claude re-runs the same checker, then imports the topics into the site.

## What's inside

| Path | Purpose |
|---|---|
| `CODEX_PROMPT.md` | the full brief: depth, style, versions, HTML rules, code rules, quiz rules, batches, definition of done |
| `spec/curriculum.json` | 16 modules, 120 topics, fixed ids, and what each topic must cover |
| `spec/videos.json` | the 49 channel videos topics can link to |
| `tools/check-tutorial.mjs` | the checker (also used by the site's importer) |
| `sample/c-tutorial/` | a finished, checked topic: `c-for-loop` |

Check the sample yourself:

```bash
node tools/check-tutorial.mjs sample/c-tutorial --sanitize
```
