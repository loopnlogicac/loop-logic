# Loop & Logic content kit

Everything Codex (or any writer) needs to produce tutorial content that the Loop & Logic site can import directly, and the checker the site's importer uses.

| File / folder | What |
|---|---|
| `CODEX_TASKS.md` | **start here:** ready-to-paste Codex task messages |
| `CODEX_TASK_2.md` | the brief for all seven subjects (format 1.1) |
| `CODEX_TASK_ML.md` | the master brief for Machine Learning from Zero (layered lessons for children and undergraduates, `ml` labs, picture questions, practice sheets) |
| `c-tutorial/CODEX_PROMPT.md` | the original brief (Task 1); still applies |
| `LAB_FORMAT.md` | interactive labs (visualisers/simulators) for Data Structures, Algorithms and Machine Learning |
| `tools/check.mjs` | the checker: format, HTML, writing quality, and it compiles and runs every C, Java, Python and MySQL program |
| `tools/labs.mjs` | the lab state model shared by the checker and the site's lab player |
| `spec/videos.json` | all 302 Loop & Logic videos |
| `<track>/spec/curriculum.json` | fixed topic lists for `c-tutorial`, `data-structures`, `algorithms`, `oop-java`, `python`, `dbms`, `compiler-design`, `machine-learning` |
| `<track>/content/` | where each track's package goes (C: `c-tutorial/c-tutorial/`) |
| `c-tutorial/sample/`, `samples/labs/` and `samples/figures/` | finished examples that pass the checker |

| Track | Topics | Labs |
|---|---|---|
| C | 120 | – |
| Data Structures (C) | 47 | 24 |
| Algorithms (C) | 56 | 32 |
| OOP (Java 17) | 41 | – |
| Python 3.12 | 45 | – |
| DBMS (MySQL 8) | 41 | – |
| Compiler Design | 36 | – |
| Machine Learning (Python 3.12, scikit-learn) | 97 | 56 |

Check a package from inside `content-kit/`:

```bash
node tools/check.mjs algorithms/content --sanitize
node tools/check.mjs --lab samples/labs/bfs --kind graph
```

You need Node 18+, gcc or clang, JDK 17+, Python 3.10+, and MySQL 8 (for DBMS, with `--require-sql`).
