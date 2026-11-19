# Machine Learning delivery notes

Current package: `machine-learning-tutorial`, version `0.2.0`, format `1.1`.

## Batch 2: Python Tools for Machine Learning

All eight `python-for-ml` topics are delivered in curriculum order:

1. `ml-setup-tools`: Python 3.12, virtual environments, the four library installs/imports, version inspection, scripts, Jupyter kernels and Google Colab.
2. `ml-python-refresher`: lists, tuples, dictionaries, loops, comprehensions, functions, f-strings and reading the shared CSV with `csv.DictReader`.
3. `ml-numpy-arrays`: numeric arrays versus lists, shape/ndim/dtype, indexing, slices, views/copies, Boolean masks and row-by-feature reshaping.
4. `ml-numpy-math`: element-wise operations, row/column broadcasting, reductions with axes, dot/matrix products and seeded generators.
5. `ml-pandas-basics`: Series/DataFrame, head/info/describe, loc/iloc, compound filtering, labelled alignment and explicit derived-column assignment.
6. `ml-loading-data`: course CSVs, types, missingness, frequencies, groups, sorting, plausibility checks, leakage and aligned X/y arrays.
7. `ml-plotting`: scatter by label, ordered lines, histograms, titles/units/legends, saved figures, trends, groups and outlier investigation.
8. `ml-python-practice-sheet`: three picture warm-ups, seven paper numericals, five executable code-reading questions, four coding tasks, four written discussions and an answers guide.

The seven lessons contain 1,020–1,066 English words each. All start with distinct stories, introduce pictures/tables before formal rules, give tiny hand calculations, and include unplugged activities and optional university-level sections. Bangla titles, summaries, key points, lab metadata and key trace notes are included; full Bangla bodies remain required only for Module 1. Review status is `draft` throughout.

New material totals **27 runnable examples, 36 practice problems (18 code solutions), 88 quiz questions (26 output and 8 picture questions), and 31 worked exam questions**. All 75 example/practice `.out` files were captured from successful isolated real runs. Three additional outputs record figure generation and the new/updated audits. Imports declare their required packages, and every dataset-reading example or solution lists its shared workdir file. Dataset programs use the existing `tiny_fruits.csv`, `fruits.csv` and `study.csv` without replacing or editing their data.

## Broadcasting lab and computed figures

`broadcasting` is the one new `ml` lab, with the required tables panel. Its three named grids show X, offsets and results. The learner can edit all ten matrix entries, change row offsets using the first two sliders, or choose a separate five-entry column offset. The lesson explains which controls apply in each mode. Each cell highlights the source entry and the reused offset before writing its actual sum; key notes explain the reason in Bangla.

The default is the same five-by-two matrix as `ml-numpy-math` examples `ex-1` and `ex-2`. The pure-Python loop, NumPy expression and final lab table all give `[[12,23],[13,22],[14,23],[16,27],[17,28]]`, total **195**. `codeExample` links to `ex-1`; the first lab check verifies the entire output matrix and total. Five presets cover ordinary row addition, zero offsets, negatives, column addition and all-zero data; five explicit checks include extreme negative permitted values. Each trace has 62 steps. The standard checker additionally fuzzes the declared inputs.

**Scope, not a simplified solver:** this lab performs exact broadcasting addition for a declared fixed 5×2 teaching matrix. It does not claim to visualise arbitrary-rank arrays. No numerical solver or random process is involved. The lesson separately teaches the general trailing-dimension compatibility rule and rejects incompatible shapes. The offsets demonstrate arithmetic and are not claimed to be plausible changes to fruit measurements.

`shared/make_python_figures.py` computes all seven new figure definitions from NumPy operations and the real shared card CSV. Eight quiz placements use these figures. The worksheet repeats its shape and grouped-mean figures as printable HTML tables; its saved scatter uses exactly the quiz panel coordinates. Three saved lesson PNGs come from the displayed Matplotlib programs. All four PNGs are below 32 KB and were visually inspected for labels, clipping, legends and meaningful marks.

## Batch 2 verification

Run from `content-kit/` (the XDG and Matplotlib cache locations are writable directories for this managed environment):

```sh
export XDG_CACHE_HOME=/tmp/ml2-cache MPLCONFIGDIR=/tmp/ml2-mpl
python3 -I -X utf8 machine-learning/content/shared/verify_content.py
python3 -I -X utf8 machine-learning/content/shared/verify_python_module.py
node tools/check.mjs --lab machine-learning/content/topics/python-for-ml/ml-numpy-math/labs/broadcasting --kind ml
node tools/check.mjs machine-learning/content --require-packages --report machine-learning/content/CHECK_REPORT.txt
```

The cumulative checker reports **0 error(s), 0 warning(s) — RESULT: READY FOR IMPORT**, covering 17 topics and four labs. The updated earlier audit retains every Module 1 assertion and reflects package version 0.2.0. It rebuilds all six shared datasets twice, verifies their bytes and checks the previous bilingual lessons, figures and lab references. `git diff --exit-code -- machine-learning/content/shared/datasets/` is clean after regeneration.

The new audit compares **110 lab traces against independent NumPy broadcasting**, checks every final result cell and total, original input preservation, deterministic traces and preset lengths, and verifies default agreement with both Python examples. It also checks computed quiz/worksheet data, exact figure regeneration, required-package declarations, and lesson layers. Output quizzes and practice solutions are executed by the main checker. NumPy Generator examples explicitly discuss cross-version stream limits rather than promising perpetual bit-for-bit reproduction.

The manifest records the real toolchain: Python 3.12.14, NumPy 2.3.5, pandas 2.2.3, scikit-learn 1.8.0 and Matplotlib 3.10.8. Syntax is written for Python 3.10+, with compatible package versions as stated in each topic; programs were executed on the recorded Python 3.12 toolchain. Notebook and Windows activation instructions are explanatory walkthroughs, not claims of execution on those platforms. Jupyter and Colab are optional interfaces, not extra runtime dependencies for the course scripts.

No curriculum coverage is omitted, no curriculum changes are proposed, and there are no open implementation questions or remaining checker warnings. Human review should focus on Bangla phrasing, child suitability and platform-specific setup instructions. Only files under `content-kit/machine-learning/content/` change.

---

## Batch 1 delivery (historical)

Package `machine-learning-tutorial`, version `0.1.0`, format `1.1`.

### Delivered

All nine topics of `ml-for-everyone`, in curriculum order:

1. `ml-what-is-learning`: cat examples, written versus learned rules, reusable models and limited predictions.
2. `ml-around-us`: recommendations, faces, maps, spam, payment alerts, Bangla word prediction and fixed automation.
3. `ml-data-features-labels`: example cards, feature units, answer labels, rows, columns and two-axis positions.
4. `ml-learning-a-rule`: trying size fences, actual mistake counts, tied minima, better evidence and counterexamples.
5. `ml-types-of-learning`: supervised, unsupervised and reinforcement feedback, choosing a setup and self-supervised language models.
6. `ml-train-and-test`: sealed answers, memorisation, overfitting, underfitting and honest reuse of a revealed test set.
7. `ml-workflow`: question, collection, cleaning, baseline, training, checking, classroom project and monitoring with a fallback.
8. `ml-responsible-for-kids`: biased opportunities and labels, privacy, consent, error costs, accountability and appeal.
9. `ml-everyone-practice-sheet`: five printable picture questions, paper counts, feedback matching, rule reading, planning, discussion and an answers guide.

Every topic includes a complete natural Bangla body. Both language bodies use the same section ids, numbers, worked examples and lab placements. The eight theory bodies are 971–1,156 English words under the kit's counter. They start with original stories, use pictures/tables before abstractions, and include unplugged activities. All required `covers` points are addressed.

There are 106 MCQs, including 22 questions with computed figures, 38 written practice problems with worked answers, and 44 exam questions including paper numericals. Correct option positions vary. The worksheet's first five quiz figures are also committed as accessible SVG pictures in both printable bodies, built from those exact panels.

### Datasets

All six course CSVs, their seeded NumPy generator and detailed README are in `shared/datasets/`. Row counts are 10, 120, 200, 250, 160 and 180 as specified. Study and rent each have six missing feature cells. Explicit outliers, their interpretation, units, labels, invented relationships and intended later uses are documented. SMS has 160 unique invented messages, balanced by class and language. Repeated SMS stems are disclosed, with a warning against an overly optimistic random-row text evaluation. No real person, phone number or private message is included.

`make_datasets.py` writes next to itself from any current directory. Two complete regenerations were byte-identical to the delivered CSVs. The supplemental audit checks row counts, missing cells, outliers, all five districts, customer identifiers and message uniqueness/language counts.

### Labs and reference agreement

- `cards-to-points` has the required tables and plot panels. It preserves every supplied row and label, including overlapping dots. First preset: ten fruits, five apples and five mangoes; p6 is at (6, 7), mango.
- `learn-a-threshold` has plot and chart panels. It tests every half-centimetre threshold on the student's points, counts actual disagreements and keeps the smaller threshold on ties. First preset: selected threshold 5, zero selected mistakes; best threshold 5, zero best mistakes. Fences 3, 4, 5 and 6 make 2, 1, 0 and 2 mistakes.
- `exam-split` has plot and chart panels. Training alone fits a single threshold, nearest-size labels and a majority baseline. Test labels start hidden; fixed predictions precede their revelation. First preset: six training and four test cards. Flat errors: 3/2, simple errors: 1/0, flexible errors: 0/2. The simple threshold is 5. Full class maps evaluate the actual trained rule at 20×20 cell centres.

All presets have 20–400 steps. Separate checks include smallest inputs, equal positions, conflicting labels, ties and fewer training examples. The standard checker also fuzzes each lab. Every key step has a Bangla note explaining its reason.

**Module 1 no-code interpretation:** The master brief explicitly calls Module 1 “No code, no formulas” and says its theory worked examples are by hand. Consequently, student-facing `examples` arrays are empty, quizzes are MCQs, and practice is written. The worksheet keeps `code-reading` and `coding` sections as paper rule reading and a future program plan. It uses the curriculum's `outputQuiz: 0` override. Nothing asks a child to read or execute Python.

To verify lab agreement without violating that course layer, each lab contains a complete **teacher-only** `reference.py` and its actual `reference.out`. The optional `codeExample` field is omitted because there is no student example id to link. `shared/verify_labs.mjs` executes the Python programs and compares their printed results to actual final lab states and the saved outputs. This applies the master brief's no-code requirement ahead of the general lab-to-student-example linking instruction.

**Solver scope:** No numerical optimisation is faked. These theory demonstrations intentionally use tiny, exact models. The threshold lab searches the stated finite half-centimetre grid; it does not claim to find a continuous optimum. The exam lab searches observed-size midpoints plus axis endpoints, choosing the larger threshold on ties, and its nearest-size model uses size only, choosing the earlier card on distance ties. These are declared in the text and pseudocode notes. Its zigzag is a size-to-predicted-label step picture, while the coloured map represents actual class regions. The split is deliberately ordered for a paper counterexample, not recommended as a universal real-data split. No seeded randomness is needed because these labs have no random operations.

### Verification and real runs

From `content-kit/`:

```sh
python3 -I -X utf8 machine-learning/content/shared/datasets/make_datasets.py
python3 -I -X utf8 machine-learning/content/shared/make_figures.py
node machine-learning/content/shared/verify_labs.mjs
python3 -I -X utf8 machine-learning/content/shared/verify_content.py
node tools/check.mjs machine-learning/content --require-packages --report machine-learning/content/CHECK_REPORT.txt
```

The seven `.out` files (dataset generator, figure builder, three lab references and two audits) were captured from successful real runs. The manifest records the real Python and four package versions. No output contains elapsed time, a model object representation or an unrounded coefficient. Data and figure regeneration is deterministic; audit output is deterministic in the supported toolchain.

The supplemental lab audit replays 156 traces, checks preset lengths and independent count/point invariants, verifies actual model predictions at region-cell centres, and flips hidden labels to prove they cannot change fitted regions or pre-reveal predictions. It also verifies that test points initially have hidden classes. The content audit checks bilingual section and lab parity, full Bangla text, worksheet/quiz figure equality and every stored program output.

Final required checker result: **0 error(s), 0 warning(s); RESULT: READY FOR IMPORT**. The report includes nine topics and three labs. Rendered all five worksheet SVGs in Chromium for a layout check.

### Review notes, curriculum suggestions and open questions

No curriculum points were omitted. No remaining checker warnings or unresolved implementation questions. No curriculum change is proposed for this delivery. If the platform later wants a jump from the no-code theory labs to teacher programs, it could add an explicit teacher-reference field; inventing a student example id would be misleading under the present brief.

The default review state remains `draft`, as required for editorial review. Human reviewers should review Bangla phrasing and age suitability, and note that zero errors on four invented hidden cards demonstrates a comparison only. Fairness examples deliberately avoid treating absent records or one group count as a complete fairness measure. Dataset relationships must not be presented as findings about actual students, Dhaka rent or customer behaviour.
