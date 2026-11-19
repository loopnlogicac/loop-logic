# Codex master brief: Machine Learning from Zero

**Format 1.1 · track `machine-learning` · 19 Nov 2026**

You are writing the Loop & Logic course **Machine Learning from Zero**: 97 topics in 11 modules, 56 interactive labs, picture-based quiz questions and a practice sheet for every module.

**Who it is for.** The same course must work for two readers at once:

- a curious **10-year-old** in Bangladesh who has never heard the word "algorithm", and
- a **CSE undergraduate** who needs the maths, the code and exam-ready answers.

You do not write two courses. You write **layered lessons**: every topic starts with a story and a picture anyone can follow, and goes one layer deeper at a time. A reader can stop at any layer and still have learned something true.

---

## 0. Read first, in this order

1. This brief. Where it differs from the others, **this brief wins**.
2. `CODEX_TASK_2.md`: format 1.1, writing rules (section 1), Python rules, batches and definition of done.
3. `c-tutorial/CODEX_PROMPT.md`: originality, HTML rules, depth, accuracy process.
4. `LAB_FORMAT.md`, especially the **`ml` kind** and the `number`, `choice` and `points` inputs.
5. The samples:
   - `samples/labs/knn/` and `samples/labs/kmeans/`: two finished `ml` labs;
   - `samples/figures/quiz-examples.json`: three quiz questions with figures;
   - `c-tutorial/sample/c-tutorial/topics/loops/c-for-loop/`: the topic file layout.
6. `machine-learning/spec/curriculum.json`: fixed modules, topic ids, order, level, kind, `covers`, `labs` (with their `panels`), `visualQuiz`, `counts` and `banglaBody`.

---

## 1. The track

| | |
|---|---|
| Curriculum | `machine-learning/spec/curriculum.json` |
| Write the package into | `machine-learning/content/` (laid out like every other package: `manifest.json`, `NOTES.md`, `CHECK_REPORT.txt`, `shared/`, `topics/<module>/<topic>/…`) |
| Language | Python 3.12 (must also work on 3.10+) |
| Packages | numpy ≥ 2.0, pandas ≥ 2.2, scikit-learn ≥ 1.5, matplotlib ≥ 3.8. Nothing else: no PyTorch, TensorFlow, seaborn or internet downloads. |
| manifest | `"track": "machine-learning"`, `"packageId": "machine-learning-tutorial"`, `packageVersion` from `0.1.0`, one minor version per batch. `toolchain` lists the real versions, e.g. `"Python 3.12.7, numpy 2.1.3, pandas 2.2.3, scikit-learn 1.5.2, matplotlib 3.9.2"`. |

Set up once:

```bash
python3 -m pip install "numpy>=2.0" "pandas>=2.2" "scikit-learn>=1.5" "matplotlib>=3.8"
```

Check, from inside `content-kit/`:

```bash
node tools/check.mjs machine-learning/content --topic ml-knn                      # while working
node tools/check.mjs machine-learning/content --require-packages --report machine-learning/content/CHECK_REPORT.txt
node tools/check.mjs --lab machine-learning/content/topics/classification/ml-knn/labs/knn --kind ml
```

`--require-packages` turns "numpy not installed, example skipped" into an error. **A batch is accepted only with 0 errors under `--require-packages`.**

---

## 2. The layered lesson

### 2.1 Sections

The checker requires these `<h2 id>` sections (the curriculum's `sections`). Use this order:

| # | id | Layer | What goes in it |
|---|---|---|---|
| 1 | `introduction` | **Story** (anyone) | A short story in a `<div class="callout story">`, then two or three plain paragraphs: what problem we have, why it matters, what you will be able to do at the end. No formulas, no code. |
| 2 | `intuition` | **Picture** (anyone) | The idea with a picture: a figure, a small table, or the lab. Explain it as you would to a 12-year-old with a pencil. Introduce at most three new words, each with `<dfn>`. |
| 3 | `how-it-works` | **By hand** (school level) | The algorithm step by step on **tiny numbers** (5–10 examples, 2 features) that the reader can follow on paper. Pseudocode in a `pre class="diagram"`. Place the lab here if it was not in `intuition`. |
| 4 | `try-it-yourself` *(recommended)* | **Do** (anyone) | What to try in the lab ("set k to 1 and move the star near the border; what happens?"), plus an **unplugged activity** in `<div class="callout unplugged">` (cards, chalk, sweets, classmates) for topics where it makes sense. |
| 5 | `examples` | **Code** (programmer) | 3–8 runnable programs (section 3), each placed with `<div data-example="ex-N"></div>` and explained. |
| 6 | `common-mistakes` | | Real mistakes beginners make: scaling forgotten, test data leaked, accuracy on imbalanced data… each with the fix. |
| 7 | `going-deeper` *(recommended)* | **Maths** (university) | The formal side in `<div class="callout deeper">` or `<div class="callout math">`: the formula, a derivation sketch, complexity, the exam-style statement. Mark it clearly as optional. |
| 8 | `summary` | | 5–8 bullet points, and one sentence linking to the next topic. |

**Theory topics** (all of Module 1 and a few others) use `introduction`, `intuition`, `worked-examples`, `try-it-yourself`, `common-mistakes`, `summary`. Worked examples there are done by hand, with no code.

**Project topics** need `introduction`; then use `the-problem`, `the-data`, `step-by-step` (sub-headings per step), `results`, `what-next`.

**Question-bank topics (practice sheets)** need `introduction`; see section 6.

New callout classes you may use: `callout story`, `callout try-it`, `callout unplugged`, `callout deeper`, `callout math`, besides the existing `note`, `tip`, `warning`, `danger`, `exam`.

### 2.2 Writing so a child can follow

This matters most in Module 1, and in the `introduction` and `intuition` of every topic.

- **Short sentences.** In Module 1, aim for an average of 12–14 words. Elsewhere, under 20.
- **One new idea at a time.** Define a word the first time with `<dfn>`, in words a child knows: "A <dfn>feature</dfn> is something we can measure about an example, like a mango's weight."
- **Concrete before abstract.** Fruits before "samples", mangoes before "class 1", exam marks before "target variable". Use real Bangladeshi life: Rajshahi mangoes, rickshaw fares, cricket scores, SSC marks, Eid shopping, Dhaka traffic, mobile banking, monsoon rain.
- **Small, friendly numbers.** By-hand examples use whole numbers or one decimal place, 5–10 data points.
- **Ask the reader.** "Which group would you put this fruit in? Look at the picture before reading on."
- **Never talk down.** No "this is easy", "simply", "obviously". Say what is hard and help with it.
- **No formula before the picture.** Module 1 has no formulas at all. Elsewhere a formula appears only after the reader has seen the idea in a picture or table, and every symbol is explained in words.

**The cast.** Stories may use these characters, so readers meet familiar faces across the course:

- **Mina**, 11, who asks "but why?" about everything;
- her grandfather **Nana**, who sells mangoes and lychees at a market stall in Rajshahi;
- **Tuktuk**, a small classroom robot that learns from examples and makes funny mistakes;
- **Rafi**, Mina's cousin, a CSE student at a university in Dhaka, who appears in the deeper sections.

Each topic's story is new and about that topic. **Never reuse a story sentence**: the checker rejects any 8+-word sentence that appears in 3 or more topics.

An example of the tone (do not copy it):

> Nana has a problem. Every morning a truck brings a mixed basket of mangoes, and he must sort the sweet Himsagar from the sour green ones before customers arrive. He does not cut every mango. He picks one up, feels how soft it is, looks at its colour, and decides in two seconds. "How do you know?" Mina asks. Nana laughs. "Fifty years of mangoes." Tuktuk has not had fifty years. Can it learn the same trick from a few dozen mangoes that Nana has already sorted?

### 2.3 Bangla

**`BANGLA_STYLE.md` is the rule book** (from round 3): ML words stay English in Bangla script (মেশিন লার্নিং, মডেল, ডেটা, ফিচার, লেবেল, ট্রেনিং, ক্লাস্টার), never যন্ত্র শিক্ষণ, উপাত্ত or স্তূপ. Even for children, use the words they will hear from teachers, with a simple Bangla explanation the first time.

- `title`, `summary`, `keyPoints[].bn`, lab titles and the key lab notes are in Bangla as everywhere else.
- **Module 1 topics (`banglaBody: true`) also need a complete `body.bn.html`** with the same sections, examples and labs as the English body. Write natural Bangla for a child, not a word-for-word translation. Keep technical words in English where Bangladeshi teachers do (feature, label, model, data), with a Bangla explanation the first time.
- Other topics may add `body.bn.html`; it is welcome but not required.

---

## 3. Code

### 3.1 Three steps for every algorithm

Each algorithm topic (KNN, regression, trees, SVM, k-means, perceptron, neural network…) has at least:

1. **From scratch**: pure Python, or Python with NumPy, on the topic's tiny dataset. The reader sees every step. Use the same variable names as the pseudocode and the lab.
2. **With scikit-learn**: the same data, the same answer, and a short note on which parameter matches which idea (`n_neighbors` is k).
3. **On a real dataset**: a course dataset (section 4) or a dataset bundled with scikit-learn (`load_iris`, `load_digits`, `load_breast_cancer`, `load_wine`, `make_moons`, `make_blobs`, `make_circles`, `make_classification`), with a train/test split and a score.

Example 1 and Example 2 must print the **same result** for the same data, and the lab must reach the same result on its first preset (see 5.2).

### 3.2 Deterministic output

The checker compares every printed character with your `.out` file, on whatever versions are installed.

- Every random thing has a seed: `np.random.default_rng(0)`, `random_state=0` in every scikit-learn call that accepts it, `train_test_split(..., random_state=0)`.
- **Round what you print**: `f"{acc:.3f}"`, `round(x, 3)`, `np.round(arr, 3)`, and `np.set_printoptions(precision=3, suppress=True)` before printing arrays. Never print raw floats like `0.30000000000000004` or full-precision coefficients.
- No timing, dates, memory addresses or object reprs (`<KNeighborsClassifier object at 0x…>`). Print what the model learned, not the model.
- **No warnings in output.** Give `LogisticRegression` and `MLPClassifier` a large enough `max_iter`. Never silence warnings to hide a real problem.
- **No internet**: no `fetch_openml`, no `fetch_*`, no URLs in `read_csv`.
- Prefer printing a few lines of results over long dumps: at most about 40 output lines per example.

### 3.3 Plots

- Examples that draw must use `import matplotlib; matplotlib.use("Agg")` before `pyplot`. They `savefig("name.png")` and **print a sentence saying what the picture shows** (the checker compares only the printed text).
- If a picture belongs in the lesson, commit it as `assets/<kebab-name>.png` (≤ 200 KB, at most 3 per topic) and place it with `<figure><img src="assets/…" alt="…"><figcaption>…</figcaption></figure>`. Describe it in the alt text for blind readers.
- Most pictures in the lesson should be **labs and figures** (they are interactive and bilingual), not PNGs.

### 3.4 The usual rules still apply

- Runs as `python3 -I -X utf8 file.py`, PEP 8, f-strings, `if __name__ == "__main__":` in programs with functions.
- `"requires": ["numpy", "pandas", "sklearn", "matplotlib"]` on every example and practice item that imports them. These are import names, so scikit-learn is `sklearn`.
- Code practice items have `tests` with stdin and expected output. A practice item that reads a dataset lists it in `"workdirFiles": ["shared/datasets/fruits.csv"]`.

---

## 4. Course datasets (Batch 1)

Create `machine-learning/content/shared/datasets/` with:

| File | Rows | Columns | Used for |
|---|---|---|---|
| `make_datasets.py` | – | – | builds every CSV below with `numpy.random.default_rng(2026)`, so the data can be rebuilt exactly. Running it twice gives identical files. |
| `tiny_fruits.csv` | 10 | `size_cm, sweetness, label` (apple/mango) | by-hand examples in Modules 1, 3 and 6 |
| `fruits.csv` | 120 | `size_cm, weight_g, sweetness, colour_score, label` (apple, mango, lychee) | classification, KNN, trees |
| `study.csv` | 200 | `hours_studied, attendance_pct, past_marks, sleep_hours, passed` (0/1), `marks` | regression and logistic regression, fairness discussion |
| `rent.csv` | 250 | `area_sqft, rooms, floor, distance_km, district, rent_bdt` | the regression project (districts: Mirpur, Dhanmondi, Uttara, Mohammadpur, Badda) |
| `sms.csv` | 160 | `text, label` (spam/ham), short messages in English and Bangla, written by you, no real phone numbers or brands | naive Bayes and the spam project |
| `shop.csv` | 180 | `customer_id, visits_per_month, avg_spend_bdt, items_per_visit, online_share` | clustering and the customer-groups project |

Use realistic but **invented** values, with a little noise, a few missing cells (in `rent.csv` and `study.csv`, for the cleaning topic) and at least one obvious outlier. Describe every dataset in `shared/datasets/README.md`: columns, units, how it was made, and which topics use it.

Examples load a dataset by listing it in `"workdirFiles": ["shared/datasets/fruits.csv"]` and calling `pd.read_csv("fruits.csv")`; the checker copies it next to the program.

---

## 5. Labs

### 5.1 What the curriculum fixes

Each topic's `labs` entry fixes the lab `id`, `kind` (always `ml`), its `panels` (the checker verifies that `init` contains them), a `title` and a `shows` sentence saying what the student must see. Build exactly that. Read `LAB_FORMAT.md` § `ml` first, then copy the patterns in `samples/labs/knn` and `samples/labs/kmeans`.

### 5.2 Rules

- **The real algorithm, on the student's data.** Where the curriculum's idea allows it, use a `points` input so students click their own data, plus a slider for the hyperparameter the topic is about. Put that slider first.
- **Agreement with the Python example.** The lab's first preset uses the same data as one of the topic's examples (usually the tiny dataset). Its final `vars` must equal what that example prints (same rounding), and one `checks` entry must prove it. Set `codeExample` to that example's id.
- **Faithful simplification is allowed, hidden simplification is not.** Some solvers are too heavy for a trace, such as SMO for kernel SVMs or exact CART on 150 points. Then implement a faithful simpler solver, for example a brute-force angle search for a hard-margin SVM on at most 20 points, kernelised Pegasos with a fixed seed, or a tree on at most 30 points. State it in the lab `summary` and in one sentence in the lesson. The `checks` then test the lab's own solver.
- **Seeded randomness only** (no `Math.random`). Bootstraps, shuffles and initial weights come from a small linear congruential generator in the trace, driven by a `seed` input.
- **Every step teaches.** Notes say why: "p4 is only 1.2 away, closer than p7, so it replaces p7 among the 3 neighbours." Use Bangla on the key steps.
- **Regions** (boundary maps): 20×20 to 40×40 cells, computed by running the trained model on each cell centre. At most 30 regions steps per trace: show the map after training, or after every few epochs.
- **Length:** 20–400 steps on presets. For long training, show the first iterations one by one, then every 5th or 10th with a note saying so.

### 5.3 Notes per lab family

| Family | What the student must see |
|---|---|
| distance, vectors, lines (Module 3) | the numbers in the formula filling in as the shapes are drawn; `segment` and `arrow` shapes with labels |
| gradient descent (regression, logistic, slopes) | the line or point moving on the plot and the cost falling on the chart *at the same step*; a learning-rate slider including a value that diverges, with the note saying so |
| KNN | distances, the neighbour circle, votes, the tie rule; boundary maps for several k |
| decision trees | every candidate threshold tried in `best-split` with its impurity in a table; in `decision-tree`, each split as a `tree-` node *and* a `line`/`segment` on the plot, leaves as `rect` regions with their class |
| perceptron, SVM | the boundary as a `line` shape; SVM margins as two dashed parallel lines; support vectors circled (`circle` shape) or marked; C and gamma sliders |
| naive Bayes | count tables filled cell by cell, smoothing visible (+1), the two class scores as bars |
| evaluation | the threshold sliding, points dropping into confusion-matrix cells (`table-set`), the ROC curve drawn point by point |
| ensembles | each member's regions or votes, then the combined result; AdaBoost point `size` growing on mistakes |
| clustering, PCA, anomalies | points recolouring with `point-set {cls}`; centres as `marker` shapes moving with an `arrow`; DBSCAN `circle`s; PCA projection `segment`s |
| neural networks | a `network` panel laid out by layers; `net-label` for activations, `net-weight` for weight changes; fixed or seeded initial weights; the loss on a chart |
| convolution | an image table, a 3×3 kernel table and an output table; the window marked with `table-mark` as it slides |

---

## 6. Questions, figures and practice sheets

### 6.1 Picture questions (visual quiz)

The curriculum gives each topic a `visualQuiz` number: at least that many quiz questions must have a **figure**, a static picture built from the same panels as a lab (`"figure": { "caption": {en, bn}, "panels": {…} }`). See `samples/figures/quiz-examples.json`.

Good picture questions make the student **read the picture and think**:

- *predict by eye*: "Which class does KNN give the star with k = 3?"
- *read a chart*: "Which degree should you choose?" from training and test error curves;
- *follow a tree*: "Where does this fruit end up?";
- *spot the problem*: "This model scores 99% on training data. Look at its boundary. What is wrong?";
- *what changes*: "If C becomes much larger, which picture shows the new margin?". The options may be described in words, or the figure can show labelled candidates A, B and C;
- *match*: "Which loss curve belongs to a learning rate that is too large?"

Compute figure data with real code (your from-scratch functions or scikit-learn), not by guessing. The explanation walks through how to read the picture.

Practice problems (`type: "written"`) and exam questions may also carry a `figure`.

### 6.2 Other questions

- Lessons: 10–20 quiz questions, at least 3 `output` questions (complete Python programs; the checker runs them), plus the figure questions.
- Quiz prompts say what they test ("Why does this KNN predict mango when most points are apples?"), never "What is the output?" on its own repeated across topics.
- `examQuestions`: include `numerical` ones (compute a Gini impurity, one gradient step, a distance, a precision) with fully worked `answerHtml`.

### 6.3 Practice sheets

Every module ends with a practice sheet (`kind: "question-bank"`). It is a printable worksheet for a class or for self-study. Its body has these sections:

1. `introduction`: what the sheet covers and how to use it (time needed, what to have ready);
2. `warm-up`: picture questions (the quiz items with figures appear here as well in the quiz);
3. `by-hand`: numerical problems to do on paper, with worked answers in the exam questions;
4. `code-reading`: output questions;
5. `coding`: code practice items with tests;
6. `think-and-explain`: written questions for discussion, including one about fairness or real-world use;
7. `answers-guide`: how to mark yourself and which topic to revisit for each kind of mistake.

The curriculum's `counts` overrides the usual counts where needed (the Module 1 sheet has no output questions; it is for children).

---

## 7. What every topic must have

A finished topic passes the checker and also meets this list. Reviewers use it.

- [ ] A story a 10-year-old enjoys, and a picture or lab before any formula.
- [ ] The algorithm by hand on tiny numbers.
- [ ] From-scratch code and scikit-learn code that agree with each other and with the lab.
- [ ] The lab from the curriculum, with the topic's key hyperparameter as a slider, and notes that explain *why*.
- [ ] `visualQuiz` picture questions, and output questions that are actually run.
- [ ] `going-deeper` with the real maths for university students (unless the topic is in Module 1).
- [ ] Common mistakes that real students make, with fixes.
- [ ] Natural Bangla wherever Bangla is required; a full Bangla body in Module 1.
- [ ] Nothing copied: original stories, original datasets, original questions.
- [ ] No sentence reused across topics, no talk about how the lesson was produced.

---

## 8. Batches

Each batch is one pull request. **Start a batch only after the previous one is merged.** Each batch raises `packageVersion` by one minor version and must leave every earlier topic passing.

| Batch | Topics | Labs | Notes |
|---|---|---|---|
| 1 | `ml-for-everyone` (all 9) + **all course datasets** | 3 | Module 1 needs full Bangla bodies. Datasets and `make_datasets.py` come first. |
| 2 | `python-for-ml` (8) | 1 | |
| 3 | `math-intuition` (10) | 9 | |
| 4 | `data-preparation` (8) | 5 | |
| 5 | `regression` (10) | 5 | |
| 6 | `classification`, topics 1–8 (`ml-what-is-classification` … `ml-gini-entropy`) | 7 | |
| 7 | `classification`, topics 9–16 (`ml-decision-tree-building` … practice sheet) | 6 | |
| 8 | `evaluation` (7) + `ensembles` (5) | 8 | |
| 9 | `unsupervised` (8) | 6 | |
| 10 | `neural-networks` (8) | 6 | |
| 11 | `projects` (8) | – | Projects reuse the course datasets. |

---

## 9. Definition of done (every batch)

1. `node tools/check.mjs machine-learning/content --require-packages --report machine-learning/content/CHECK_REPORT.txt` reports **0 errors**. Commit the report.
2. Every `.out` file came from a real run on the versions listed in `manifest.toolchain`.
3. `python3 shared/datasets/make_datasets.py` rebuilds identical CSVs (check with `git diff --exit-code` after running it).
4. `NOTES.md` lists, for this batch: topics delivered, labs delivered, any simplified lab solver and why, anything you think the curriculum should change, and open questions.
5. Only files inside `content-kit/machine-learning/content/` changed.
6. The pull request is titled `Machine Learning – Batch N` and its description lists the topics, the labs and the checker summary line.
