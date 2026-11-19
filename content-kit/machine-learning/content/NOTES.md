# Batch 4 — Getting Data Ready

Current package: `machine-learning-tutorial`, **0.4.0**, format 1.1. This delivery adds all eight `data-preparation` topics in curriculum order:

1. `ml-features-deep-dive`: useful, useless and harmful features; prediction-time leakage; derived BMI features; domain knowledge and feature count.
2. `ml-data-types`: continuous/discrete quantities, nominal/ordinal categories, text/image representations, dates and pandas dtype checks.
3. `ml-missing-and-dirty-data`: missingness, dropping versus mean/median/mode filling, duplicates, impossible values, outlier investigation and `SimpleImputer`.
4. `ml-encoding`: ordinal assumptions, full one-hot indicators, `OneHotEncoder`, `get_dummies`, unknown names and large vocabularies.
5. `ml-feature-scaling`: min-max and population standardisation, model sensitivity, constant columns and training-only fitting.
6. `ml-train-validation-test`: fitting/selection/evaluation roles, seeded and stratified splits, leakage, repeated identities and chronological evaluation.
7. `ml-eda`: a question-led checklist, histograms, box plots, scatter plots, Pearson correlation and its limits.
8. `ml-data-practice-sheet`: four printable picture warm-ups, six paper numericals, five code-reading programs, two coding problems, written discussion and marking guidance.

All seven lessons contain an original story, a picture/table before formulas, hand calculations, an unplugged activity, runnable code, common mistakes and optional university-level material. Their English bodies meet the beginner word target. Required Bangla titles, summaries, key points, lab titles, figure captions and key trace notes use the spellings and classroom style in `BANGLA_STYLE.md`. Full Bangla bodies from Module 1 are preserved.

## Five labs and their conventions

Each lab has editable controls, three named presets, three explicit checks, bilingual explanatory notes and a link to its matching `ex-1`. All preset traces have 20–400 meaningful steps.

- `fill-missing` (`tables`): fit a mean or median separately for each column, then copy observed cells and fill only blanks. Students edit the measured cells; three fixed missing locations are documented. Default medians are x=5, y=3, three gaps, completed total 50. An outlier preset exposes the mean/median difference. Both Python and `SimpleImputer` give the default result.
- `one-hot` (`tables`): a pre-fitted Badda/Mirpur/Uttara vocabulary transforms editable B/M/U/? strings row by row. Default six known names give six ones. Unknown-ignore produces zeros; unknown-error visibly marks rejected rows as ERROR so students can inspect the rest. This is an explicit teaching presentation: the real encoder raises an exception under the error policy. The lesson states that distinction. Both Python and `OneHotEncoder` agree on the default numeric transformation.
- `feature-scaling` (`plot`): actual raw and transformed distances, query transformation, record-matching arrows and nearest links. Default raw nearest is row 2 and min-max nearest is row 4, with a clear distance gap. Both Python and `MinMaxScaler` agree. Standardisation uses population variance; constant columns use divisor 1. The single plot contains two views; one uniform multiplier per view preserves that view's Euclidean neighbour ranking. Display coordinates are disclosed, and numeric transformed values remain visible in notes/variables. Matching arrows are not claimed to be KNN distances.
- `stratified-split` (`plot`, `chart`): seeded Fisher–Yates random and stratified 70/30 allocations, plus bars of class-1 share in source/training/test for both methods. The selected plot colour means partition; point labels preserve original classes. Largest-remainder quotas use class-0-first ties. The default gives train=7, test=3, one minority test row under each method. This exact teaching shuffle is implemented in Python and checked with NumPy labels; it does not claim scikit-learn's internal random stream. The course-data example separately demonstrates `train_test_split(..., random_state=0, stratify=y)` with 60/20/20 partitions and validation-selected tree depth. Absent classes and infeasible exact proportions are explained.
- `correlation-explorer` (`plot`): a slider from -1 to 1 constructs six centred points from unit-spread x and orthogonal unit-spread noise. Pearson r and the least-squares line are computed from the resulting points, with visible vertical residuals. Default r=0.6, slope=0.6, intercept=0; NumPy and `LinearRegression` agree. This constrained cloud demonstrates specified correlations; it does not pretend arbitrary clouds have the slider's r. Zero-spread undefined correlation and nonlinear zero-correlation patterns are taught separately.

There is no approximate estimator solver hidden in these labs. The constrained correlation construction, fixed imputation holes, pre-fitted category vocabulary, error-row presentation and teaching shuffle are disclosed in the lessons and above.

## Examples, shared data and questions

New totals: **21 executed examples, 32 practice items (16 coding), 85 quiz questions (26 executed output questions and 18 picture questions), and 31 worked exam answers**. Answer positions rotate. All example and practice `.out` files came from actual isolated Python runs; outputs are rounded and deterministic. Dataset-reading examples declare their shared workdir files and imported packages.

The existing `rent.csv` and `study.csv` remain unchanged. Both have six missing cells. Examples investigate the impossible 30-hour daily study value and the 500,000 BDT rent without automatically treating every unusual observation as false. Prediction examples exclude final `marks` when predicting `passed`. Learned medians, vocabularies and scalers fit training rows only. The rent EDA picture is a real headless Matplotlib output saved as a 28 KB lesson asset.

`shared/make_preparation_figures.py` computes 14 reusable panel figures using real arrays, fitted encoders/scalers, quotas and correlation calculations. The 18 question placements include the practice sheet's four matching SVGs. All four printable SVGs were rasterised and visually inspected; the EDA PNG was also inspected. Labels and numbers are readable without clipping.

## Verification

Run from `content-kit/`:

```sh
python3 -m pip install "numpy>=2.0" "pandas>=2.2" "scikit-learn>=1.5" "matplotlib>=3.8"
python3 -I -X utf8 machine-learning/content/shared/make_preparation_figures.py
python3 -I -X utf8 machine-learning/content/shared/verify_preparation_module.py
python3 -I -X utf8 machine-learning/content/shared/verify_content.py
python3 -I -X utf8 machine-learning/content/shared/verify_python_module.py
python3 -I -X utf8 machine-learning/content/shared/verify_math_module.py
node tools/check.mjs machine-learning/content --require-packages --report machine-learning/content/CHECK_REPORT.txt
```

Installation completed with all requested minimum versions satisfied. Actual versions are Python 3.12.14, NumPy 2.3.5, pandas 2.2.3, scikit-learn 1.8.0 and Matplotlib 3.10.8, recorded in the manifest. New Python files parse under Python 3.10 syntax; runtime verification used the recorded toolchain. Writable temporary `MPLCONFIGDIR` and `XDG_CACHE_HOME` directories were supplied for plotting in this environment.

The new independent audit verifies **205 traces**, including all presets/checks and 35 additional seeded cases per lab. NumPy/scikit-learn independently check imputed tables, one-hot cells, scaler arithmetic, transformed plot positions, nearest links, Pearson coefficients and least-squares residuals. Integer quotas and a separate Python shuffle verify allocation counts, partition colours and class-share bars. Audits also check deterministic replay, unchanged inputs, prescribed preset lengths, figure provenance, worksheet/quiz agreement and all five default example pairs.

All earlier audits pass: the Module 1 content/lab references, 110 broadcasting traces and 369 maths traces. Both older version assertions are updated to the current package version. All six CSVs rebuild byte-identically twice, and no dataset changes are included. `git diff --check` passes.

Required checker result: **0 error(s), 0 warning(s); RESULT: READY FOR IMPORT**. The cumulative package contains **35 topics and 18 labs**. Only files under `content-kit/machine-learning/content/` change.

No curriculum changes are proposed, no requested points are omitted and no implementation questions remain open. Review status remains `draft` for human editorial review. The invented datasets teach preparation mechanics and do not support real housing prices, student decisions or causal claims.

---

# Batch 3 — Maths You Can See

Package `machine-learning-tutorial` is now **0.3.0**, format 1.1. This delivery adds all ten `math-intuition` topics in curriculum order:

1. `ml-points-and-vectors` — coordinate positions, arrow addition/scaling, higher dimensions and NumPy.
2. `ml-distance` — Euclidean/Manhattan routes, feature similarity and unit-sensitive rankings.
3. `ml-mean-spread` — mean, median, modes, range, variance, standard deviation, outliers and pandas `describe()`.
4. `ml-lines-and-slopes` — slope/intercept, query predictions, signed residuals and a preview of fitting on held-out invented study data.
5. `ml-functions-curves` — line, square, exponential, natural logarithm, sigmoid and domain-aware plotting.
6. `ml-probability` — outcomes/events, counting, observed frequencies, the law of large numbers and seeded NumPy coin/die experiments.
7. `ml-conditional-probability` — changed denominators, independence, Bayes, medical-test base rates and an SMS clue count.
8. `ml-slopes-and-minimums` — local change ratios, derivatives, gradient steps, stability, partial slopes and stationary points.
9. `ml-matrices` — shape, row dot products, `X @ w`, transpose and feature/weight alignment.
10. `ml-math-practice-sheet` — six printable picture warm-ups, paper numericals, two code-reading questions, coding tasks, discussion and an answers guide.

The nine lessons have original stories, a picture/table before formulas, 5–10-row paper examples where applicable, an unplugged activity, runnable code and optional deeper maths. English lesson bodies meet their level's full depth target. Required Bangla titles, summaries, key points, figure captions and key lab notes follow `BANGLA_STYLE.md`. Complete Bangla bodies remain present for all nine Module 1 topics.

## Labs and numerical conventions

All nine prescribed labs are delivered with their required panels, adjustable inputs, bilingual explanatory notes, three presets and three explicit checks:

- `vector-play`: two student arrows, head-to-tail addition and positive/zero/negative scaling; first preset sum (3,4), scaled (6,8).
- `distance-explorer`: student endpoints, signed changes, labelled straight/block segments; default distances 5 and 7.
- `mean-and-spread`: editable observations plus an outlier slider, mean/median markers and squared-gap bars; default mean 3.333, median 3, population variance 1.889, standard deviation 1.374.
- `line-explorer`: slope/intercept/query sliders and student points, actual vertical residuals; default query 13, MSE 0.4. It evaluates chosen parameters and does not claim to fit them.
- `curve-shapes`: five real functions sampled on their valid domains, positive query slider; default outputs 5,4,7.389,0.693,0.881.
- `coin-flips`: probability/trial/seed controls and up to 500 actual simulated tosses; seed 7 at p=0.5 gives 52 heads in 100 trials, frequency 0.52. Show every early toss, then every fifth and the final toss, explicitly narrated.
- `bayes-table`: expected counts for 1000 people; default TP=9, FP=99, positives=108, posterior 0.083. Fractional cells are explicitly expected counts; no early rounding to people. Sensitivity is at least 0.1 and the ill count at least one, ensuring a nonzero positive denominator in the interactive lab; coding tasks also handle undefined denominators.
- `roll-to-the-bottom`: exact gradient updates on `(x-1)^2`, including a diverging learning rate 1.25; default final x=1.001 and displayed cost=0 after twelve updates. The chart point's x and cost coordinates update in the same operation. Rounded zero is explicitly distinguished from exact convergence.
- `matrix-vector`: student rows and two weights, matching cells highlighted before each product, all outputs filled; default outputs 4,7,8,2,8, total 29.

These are exact mathematical demonstrations, with no hidden approximate estimator solver. Curve drawing uses finite samples; the coin generator is an explicitly specified teaching LCG, not a physical randomness test. Population variance divides by n, while pandas' default sample standard deviation divides by n-1. These distinctions are taught in the relevant bodies and notes.

Each default lab result agrees numerically with **both** `ex-1` (explicit arithmetic) and `ex-2` (NumPy), and its first check proves the stated result. `codeExample` links to `ex-1`. Mathematical primitives use their appropriate NumPy counterparts rather than inventing scikit-learn estimator APIs; scikit-learn additionally verifies distances and previews a fitted straight line. Course-data examples use the existing fruit, study and SMS collections. The separate NumPy Generator experiment intentionally uses a different seeded stream from the lab and explains this distinction.

## Questions and pictures

The module adds 28 runnable examples, 42 practice items (including 20 coding tasks), 106 quiz items with **29 executed output questions**, 28 picture questions and 37 exam questions with worked answers. Correct answer positions rotate. The practice sheet uses its curriculum override of two output questions.

`shared/make_math_figures.py` computes 22 panel figures and six worksheet SVGs from actual arrays, function evaluations, the seeded coin recurrence and gradient updates. The six printable images exactly match the first six worksheet quiz panels, carry meaningful alt text in the body, and can be regenerated. No internet data or additional runtime packages are used.

## Earlier-module Bangla fixes

Module 1's eight warnings are resolved in context: মেশিন for machine, ডেটাসেট for collections of cards/data, and ডেটা rather than object-language wording about examples. Dataset size phrases explicitly refer to the number of examples. Common technical terms in Bangla prose now consistently use মডেল, ডেটা, ফিচার, লেবেল, ট্রেনিং and টেস্ট. The three lab placements, section ids, calculations and English lessons are preserved. The earlier figure builder/catalogue and affected worksheet SVG remain consistent with the revised Bangla captions. The cumulative content audit now expects version 0.3.0.

## Verification

From `content-kit/`, on Python 3.12.14, NumPy 2.3.5, pandas 2.2.3, scikit-learn 1.8.0 and Matplotlib 3.10.8:

```sh
python3 -m pip install "numpy>=2.0" "pandas>=2.2" "scikit-learn>=1.5" "matplotlib>=3.8"
python3 -I -X utf8 machine-learning/content/shared/make_math_figures.py
python3 -I -X utf8 machine-learning/content/shared/verify_math_module.py
python3 -I -X utf8 machine-learning/content/shared/verify_content.py
python3 -I -X utf8 machine-learning/content/shared/verify_python_module.py
node tools/check.mjs machine-learning/content --require-packages --report machine-learning/content/CHECK_REPORT.txt
```

The installation command completed with all four minimum versions satisfied. Writable temporary `MPLCONFIGDIR` and `XDG_CACHE_HOME` directories were supplied for headless plotting in this read-only-home environment; course programs do not depend on those particular paths.

The new independent audit checks **369 traces**: all presets/checks plus 35 seeded input combinations per lab. It compares numeric results against independent NumPy calculations (and a closed-form gradient recurrence), verifies drawn gaps, curves, counts, row outputs and atomic position/cost updates, and checks input preservation, pure deterministic replay and 20–400-step preset lengths. It executes all 28 new saved examples and all 29 output questions, checks package declarations and lesson layers, and verifies the 28 figure questions and six SVGs. Coding solutions and their edge cases are executed by the required checker.

All six shared CSV files were regenerated twice and remained byte-identical. The Module 1 audit, its 156-trace lab audit and references pass; the Module 2 audit still passes all 110 broadcasting traces and figure/worksheet checks. All new `.out` files were captured from real successful runs. `git diff --check` passes. All six worksheet SVGs were rasterised with Inkscape and visually inspected together for labels, values and clipping.

Final required checker result: **0 error(s), 0 warning(s); RESULT: READY FOR IMPORT**. It checks all 27 cumulative topics and 13 labs. Only files under `content-kit/machine-learning/content/` change.

No curriculum points are omitted, no curriculum changes are proposed and there are no open implementation questions. Editorial review should focus on natural Bangla, the child-to-university progression, and the explicit limits of the invented datasets and toy medical probabilities. Review status remains `draft` for human editorial review. Python syntax supports 3.10+; actual runs used the recorded 3.12 toolchain and compatible installed package versions.

---

# Machine Learning delivery notes

Historical package at Batch 2: `machine-learning-tutorial`, version `0.2.0`, format `1.1`.

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
