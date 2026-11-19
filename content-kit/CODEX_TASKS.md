# Codex tasks, ready to paste

Run these on **Codex web, repository `loopnlogicac/loop-logic`, branch `main`**. Each message is one task and opens one pull request.

- **Different subjects can run in parallel:** they write to different folders.
- **Batches of the same subject run one after another.** Merge batch N's pull request before starting batch N+1, so Codex starts from the earlier topics.

After a pull request opens, tell Claude. Claude runs the checker, reviews the writing, and imports the content into the site.

---

## Start here: the first batch of every subject

### A. C: fix Batch 1 and write Batch 2
```
Work inside the folder content-kit/. Read CODEX_TASK_2.md in full, then c-tutorial/CODEX_PROMPT.md, the sample topic in c-tutorial/sample/ and c-tutorial/spec/curriculum.json.
If content-kit/c-tutorial/c-tutorial/ does not exist on your branch, bring in Batch 1 first: git fetch origin codex/c-tutorial-batch-1 && git checkout origin/codex/c-tutorial-batch-1 -- content-kit/c-tutorial/c-tutorial
Then revise all 18 Batch 1 topics as section 1 of CODEX_TASK_2.md requires (upgrade them to schemaVersion 1.1), and write C Batch 2: modules operators, decision-making and loops.
Compile and run every program, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs c-tutorial/c-tutorial --sanitize --report c-tutorial/c-tutorial/CHECK_REPORT.txt until it reports 0 errors. Set packageVersion to 0.2.0.
Change only files in content-kit/c-tutorial/c-tutorial/. Open a pull request titled "C – Batch 1 fixes + Batch 2".
```

### B. Data Structures: Batch 1 (with labs)
```
Work inside the folder content-kit/. Read CODEX_TASK_2.md in full, then c-tutorial/CODEX_PROMPT.md, LAB_FORMAT.md, the samples in samples/labs/ and c-tutorial/sample/, and data-structures/spec/curriculum.json.
Write Data Structures Batch 1 (modules foundations, arrays and linked-lists, including all 7 labs listed in the curriculum for these topics) into a new package folder data-structures/content/.
All code is C17. Compile and run every program, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs data-structures/content --sanitize --report data-structures/content/CHECK_REPORT.txt until it reports 0 errors. packageVersion 0.1.0.
Change only files in content-kit/data-structures/content/. Open a pull request titled "Data Structures – Batch 1".
```

### C. Algorithms: Batch 1 (with labs)
```
Work inside the folder content-kit/. Read CODEX_TASK_2.md in full, then c-tutorial/CODEX_PROMPT.md, LAB_FORMAT.md, the samples in samples/labs/ and c-tutorial/sample/, and algorithms/spec/curriculum.json.
Write Algorithms Batch 1 (modules foundations, searching and sorting, including all 9 labs listed in the curriculum for these topics) into a new package folder algorithms/content/. You may adapt samples/labs/bubble-sort for the bubble-sort lab.
All code is C17. Compile and run every program, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs algorithms/content --sanitize --report algorithms/content/CHECK_REPORT.txt until it reports 0 errors. packageVersion 0.1.0.
Change only files in content-kit/algorithms/content/. Open a pull request titled "Algorithms – Batch 1".
```

### D. Python: Batch 1
```
Work inside the folder content-kit/. Read CODEX_TASK_2.md in full, then c-tutorial/CODEX_PROMPT.md, the sample topic in c-tutorial/sample/ (for structure and tone) and python/spec/curriculum.json.
Write Python Batch 1 (modules basics and control-flow) into a new package folder python/content/. Python 3.12, idiomatic, explained from zero with "If you know C" callouts.
Run every program, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs python/content --report python/content/CHECK_REPORT.txt until it reports 0 errors. packageVersion 0.1.0.
Change only files in content-kit/python/content/. Open a pull request titled "Python – Batch 1".
```

### E. OOP in Java: Batch 1
```
Work inside the folder content-kit/. Read CODEX_TASK_2.md in full (especially the Java rules), then c-tutorial/CODEX_PROMPT.md, the sample topic in c-tutorial/sample/ and oop-java/spec/curriculum.json.
Write OOP Batch 1 (modules java-basics and classes-objects) into a new package folder oop-java/content/. Every program is one file with class Main and compiles with javac --release 17 -Xlint:all -Werror.
Run every program, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs oop-java/content --report oop-java/content/CHECK_REPORT.txt until it reports 0 errors. packageVersion 0.1.0.
Change only files in content-kit/oop-java/content/. Open a pull request titled "OOP (Java) – Batch 1".
```

### F. DBMS: Batch 1 (with the shared datasets)
```
Work inside the folder content-kit/. Read CODEX_TASK_2.md in full (especially the SQL rules), then c-tutorial/CODEX_PROMPT.md, the sample topic in c-tutorial/sample/ and dbms/spec/curriculum.json.
First install and start MySQL if it is missing: sudo apt-get update && sudo apt-get install -y mysql-server && sudo service mysql start && sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';" then export MYSQL_USER=root MYSQL_PWD=root MYSQL_HOST=127.0.0.1.
Write the three datasets (dbms/content/shared/datasets/university.sql, shop.sql, library.sql) and DBMS Batch 1 (modules foundations, er-modelling, relational-model and sql-basics) into a new package folder dbms/content/.
Run every query on MySQL, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs dbms/content --require-sql --report dbms/content/CHECK_REPORT.txt until it reports 0 errors. packageVersion 0.1.0.
Change only files in content-kit/dbms/content/. Open a pull request titled "DBMS – Batch 1".
```
If Codex says it cannot install packages, add the install line as the environment's setup script in Codex settings (Environments → loop-logic → Setup script), then run the task again.

### G. Compiler Design: Batch 1
```
Work inside the folder content-kit/. Read CODEX_TASK_2.md in full, then c-tutorial/CODEX_PROMPT.md, the sample topic in c-tutorial/sample/ and compiler-design/spec/curriculum.json.
Write Compiler Design Batch 1 (modules introduction and lexical-analysis) into a new package folder compiler-design/content/. Implementations are Python 3.12; theory topics use full worked tables and written practice with worked answers.
Run every program, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs compiler-design/content --report compiler-design/content/CHECK_REPORT.txt until it reports 0 errors. packageVersion 0.1.0.
Change only files in content-kit/compiler-design/content/. Open a pull request titled "Compiler Design – Batch 1".
```

### H. Machine Learning: Batch 1 (Module 1 for children + the course datasets)
```
Work inside the folder content-kit/. Read CODEX_TASK_ML.md in full (it is the master brief for this subject), then CODEX_TASK_2.md, c-tutorial/CODEX_PROMPT.md, LAB_FORMAT.md (especially the "ml" kind), samples/labs/knn, samples/labs/kmeans, samples/figures/quiz-examples.json and machine-learning/spec/curriculum.json.
First install the packages: python3 -m pip install "numpy>=2.0" "pandas>=2.2" "scikit-learn>=1.5" "matplotlib>=3.8"
Write Machine Learning Batch 1 into a new package folder machine-learning/content/: all course datasets in shared/datasets/ (with make_datasets.py and README.md), then all 9 topics of module ml-for-everyone with their 3 labs, their picture questions and full Bangla bodies.
Run every program, write every .out file from real runs, and from inside content-kit/ run: node tools/check.mjs machine-learning/content --require-packages --report machine-learning/content/CHECK_REPORT.txt until it reports 0 errors. packageVersion 0.1.0.
Change only files in content-kit/machine-learning/content/. Open a pull request titled "Machine Learning – Batch 1".
```
Later Machine Learning batches follow the table in section 8 of `CODEX_TASK_ML.md` (11 batches). Use the "later batches" message below with `--require-packages`.

---

## Later batches (after the previous batch of that subject is merged)

```
Work inside the folder content-kit/. Re-read CODEX_TASK_2.md (and CODEX_TASK_ML.md for Machine Learning). Continue <SUBJECT> with Batch <N> exactly as section 5 of CODEX_TASK_2.md lists (section 8 of CODEX_TASK_ML.md for Machine Learning), keeping every earlier topic unchanged unless the checker or the review notes in NOTES.md ask for a fix. Bump packageVersion to 0.<N>.0. Run the same check command as before until it reports 0 errors. Change only files in content-kit/<FOLDER>/. Open a pull request titled "<SUBJECT> – Batch <N>".
```

| Subject | Folder | Batches | Check command extras |
|---|---|---|---|
| C | `c-tutorial/c-tutorial` | 3–7 | `--sanitize` |
| Data Structures | `data-structures/content` | 2–4 | `--sanitize` |
| Algorithms | `algorithms/content` | 2–4 | `--sanitize` |
| OOP (Java) | `oop-java/content` | 2–3 | |
| Python | `python/content` | 2–4 | |
| DBMS | `dbms/content` | 2–3 | `--require-sql` (start MySQL first) |
| Compiler Design | `compiler-design/content` | 2–3 | |
| Machine Learning | `machine-learning/content` | 2–11 (see `CODEX_TASK_ML.md` §8) | `--require-packages` |

---

## Round 2 (19 Nov 2026): next batch of every subject

Batch 1 of every subject (and C Batch 2) is merged and live on the site. Start each message as a **new task with the `loopnlogicac/loop-logic` repo attached**, one subject per task. These can all run at the same time.

Review note for every subject (it is also in the messages): writing in Batch 1 was good. Avoid sentences that describe the lesson's own placeholders or templates (for example "The body descriptions above stand for your statements"). Show a real line of code instead.

| Task | Subject | Batch | Modules |
|---|---|---|---|
| R2-A | C | 3 | functions, arrays |
| R2-B | Data Structures | 2 | stacks, queues (7 labs) |
| R2-C | Algorithms | 2 | divide-conquer, greedy, dynamic-programming (10 labs) |
| R2-D | OOP (Java) | 2 | inheritance-polymorphism, design |
| R2-E | Python | 2 | data-structures, functions |
| R2-F | DBMS | 1 | foundations, er-modelling, relational-model, sql-basics + the 3 datasets (task F above) |
| R2-G | Compiler Design | 2 | syntax-analysis |
| R2-H | Machine Learning | 2 | python-for-ml (1 lab) |
