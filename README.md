# Loop & Logic — AI Teacher (LearnSphere AI)

An adaptive learning platform for the International AI Builders Congress
(Idea to Unicorn, LearnSphere AI challenge). Three parts, one engine:

1. **Lessons that adapt to the reader.** Select any text (or tap **?** beside a
   paragraph) for a short answer, a search of trusted sources, or a quiz. The
   page changes its wording level, adds term help and extra worked examples,
   and suggests display changes, based only on reading evidence. Every change
   is explained under **Why is this tailored?** and can be undone with
   **Show original**.
2. **Practice: judge the AI coworker.** A pricing task where the AI's advice may
   be wrong. Code checks the numbers, rules find *why* the learner went wrong,
   and the next task is chosen with a stated reason.
3. **Sealed check and evidence.** A fresh task with no help; answer keys never
   leave the server. The result goes on an evidence receipt. Instructors see
   class patterns, with small groups hidden.

```
lesson ─ select text ─▶ glossary │ reviewed library │ approved websites ─▶ (optional) AI rewording ─▶ validator ─▶ answer + sources
   ▲                                                                                                                  │
   └──────── reading profile (versioned rules, reasons in EN/BN) ◀── selections, quizzes, time on paragraph, feedback ◀┘

practice ─▶ verifier (code) ─▶ diagnosis (rules) ─▶ next task + reason ─▶ sealed check ─▶ evidence receipt ─▶ instructor view
```

## Run it

Needs **Node.js 22.18 or newer** (it runs TypeScript directly). No `npm install`.

```sh
npm start          # http://127.0.0.1:8787
npm test           # 71 tests
```

With no `.env` it runs fully offline: memory store, anonymous cookie, reviewed
help text, library search. Add keys to switch each part on (below).

Pages (all in English and Bangla, desktop and mobile):

| Page | What it is |
| --- | --- |
| `/` | Public landing page: how it works, channel numbers, courses, institutions, pricing, FAQ |
| `/courses.html` | Catalog of 21 courses built from the YouTube playlists (8 with lessons and labs); search and subject filters |
| `/course.html?id=…` | One course: adaptive lessons with progress, practice, video playlists |
| `/dashboard.html` | Learner home: continue reading, stats, lessons, practice, focus areas, receipts |
| `/lesson.html?id=…` | Adaptive reader with select-to-ask sidebar; ends with the lab and the matching channel videos |
| `/lab.html?id=…` | Hands-on lab for a lesson: tools, setup checklist, starter, tasks, expected result, checked questions |
| `/practice.html` | Judge the AI coworker → sealed check → receipt |
| `/profile.html` | Settings, everything the platform learned (with reasons), data download and reset |
| `/instructor.html` | Class view (press **Add labelled demo learners** for data) |

Course data lives in `src/content/courses.ts` (channel numbers checked 15 Nov 2026 — update them before each submission). **Prices on the landing page are drafts**: change them in `public/index.html` and `public/landing.js`.

### Two-minute demo script

1. **Lesson** → select “Margin expresses the same profit…” → **Explain**. A
   one-tap prior-knowledge question appears once; answer or skip. A short,
   cited answer follows. Try **Simpler**, **An example**, then **Quiz me**.
2. Select the word “markup”: the answer comes from the glossary, with no AI
   call. Do that for three terms and the page switches to simpler wording with
   term help; **Why is this tailored?** says so. Tick **Show original** to compare.
3. Move the discount slider in the calculator (interactive blocks are never
   personalised). Switch to **বাংলা** at any point.
4. **Practice** → accept the AI coworker's 10% discount → see the over-reliance
   diagnosis and **Under the hood**. Get two right without help → sealed check
   → receipt.
5. **Instructor** → add demo learners → difficulties, help vs. independent,
   most-asked paragraphs, AI cost. Demo learners are labelled synthetic.

## Lessons and labs

Nine lessons, each tied to Loop & Logic videos (ids and titles read from the channel on 17 Nov 2026) and each with one lab.

| Course | Lesson (`id`) | Channel video(s) | Lab | Lab tool (free, in the browser) |
| --- | --- | --- | --- | --- |
| Machine Learning | `classification-threshold` | Logistic Regression (related) | Count mistakes at every threshold | Google Colab / OnlineGDB (Python) |
| Machine Learning | `confusion-matrix` | Confusion Matrix, Precision, Recall & F1 | Precision and recall with scikit-learn | Google Colab |
| Basic Accounting | `margin-basics` | Cost-Volume-Profit (related) | Build a discount checker | Google Sheets |
| Operating Systems | `cpu-scheduling` | FCFS; SJF | Simulate FCFS and SJF | Google Colab / OnlineGDB (Python) |
| Data Structures | `stack-queue` | Stack Oneshot; QUEUE one-shot; Stack & Queue questions | Array stack in C, then a queue | OnlineGDB (C) / Code::Blocks |
| Algorithms | `euclid-gcd` | Euclidean Algorithm for GCD | Race Euclid against brute force | Google Colab / OnlineGDB (Python) |
| Discrete Mathematics | `propositional-logic` | Propositional Logic (both series) | Truth-table machine | Google Colab / OnlineGDB (Python) |
| Digital Logic Design | `logic-gates` | Boolean Algebra & Logic Gates; All Logic Gates | Build XOR from basic gates, then NAND | CircuitVerse |
| Electric Circuits | `ohms-law` | Circuit Basics & Ohm's Law; Series & Parallel | Measure series and parallel circuits | Falstad simulator / Tinkercad |

- Every lesson has three wording levels in English and Bangla, quizzes, a worked example, reviewed library passages and glossary terms, so select-to-ask works on all of them.
- Every code starter was run (Python 3.12, GCC 13, scikit-learn) and the expected outputs in the labs are the real outputs. Lab check answers stay on the server; a wrong try reveals nothing.
- Answer options for quizzes, prerequisite checks and lab checks are shown in a fixed shuffled order, so the correct one is not always first.
- Labs are the same for every learner (not personalised). Setup ticks are kept in the browser; lab results count on the dashboard and course page.

**To add a lesson:** add it to `src/content/lessons-more.ts`, its passages and glossary terms to `src/content/library-more.ts`, its lab to `src/content/labs.ts`, and its id to the course in `src/content/courses.ts`. `npm test` then checks that it is complete in both languages, that locked facts appear in every version, that every passage exists and that it has a video, a quiz and a lab.

## Configuration (`.env`)

Copy `.env.example` to `.env`. Never commit it or paste keys in chat.

| Variable | Turns on | Without it |
| --- | --- | --- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Postgres store (data survives restarts) | Memory store |
| `AUTH_MODE=supabase` + `SUPABASE_ANON_KEY` | Google / email-link sign-in | Anonymous HttpOnly cookie |
| `GEMINI_API_KEY` (`GEMINI_MODEL`) | AI rewording of answers, first choice | Reviewed text only |
| `GROQ_API_KEY` (`GROQ_MODEL`) | Fallback AI provider | — |
| `TAVILY_API_KEY` | Live search limited to approved sites | Reviewed library only |
| `INSTRUCTOR_KEY` | Protects `/instructor.html` | Dashboard open (fine locally only) |
| `MIN_GROUP_SIZE` | Privacy minimum for class stats (default 3) | — |
| `FREE_DAILY_AI_CALLS` | AI-worded answers per learner per day (default 10, the Free plan) | — |
| `ALLOW_DEMO_SEED=false` | Hides the demo-data button | Button available |

### Supabase setup (once)

1. Create a project (Singapore region). Copy the URL, anon key and service-role key into `.env`.
2. SQL editor → run `db/migrations/001_core.sql`, then `db/migrations/002_video_extras.sql`. Run the checks at the bottom of 001; each should return the expected result.
3. Auth → URL configuration: set the Site URL to your deployed address and add it (and `http://127.0.0.1:8787/**` for local) to Redirect URLs.
4. Auth → Providers: turn on Google (needs a Google Cloud OAuth client; add `https://<project>.supabase.co/auth/v1/callback` as its redirect URI). Email links work on the built-in mailer but it is limited to about 2 emails an hour — set up custom SMTP before a pilot.
5. Set `AUTH_MODE=supabase` and restart. The startup log shows `data: supabase` and `sign-in: supabase`.

### Verify on first run

These integrations are written against the providers' documented APIs and
tested with fake servers; they have **not** yet been run against the live services.

- [ ] Startup log lists the AI providers you configured.
- [ ] Lesson → **Explain** on a paragraph shows the badge *Reworded by AI · checked against the sources* (if it always says *reviewed notes*, check the server log for `llm` errors; the validator may be rejecting answers).
- [ ] **Search trusted sources** → **Search latest from approved sites** returns only openstax.org / nbr.gov.bd / bb.org.bd links (business) or scikit-learn.org / developers.google.com (ML).
- [ ] Restart the server: practice sessions and the reading profile survive (Supabase store).
- [ ] Google sign-in returns to the same page signed in; a second account cannot see the first account's sessions.
- [ ] Instructor dashboard → AI use shows token counts after a few answers.

## What is where

| Area | Where |
| --- | --- |
| Money, verifier, scenarios, grading, diagnosis, adaptation, evidence | `src/core/` |
| Sealed check (answer keys) | `src/assessment/vault.ts` — teaching code may not import it |
| Practice service, instructor overview, demo seeding | `src/app/` |
| Lessons (3 wording levels × EN/BN, locked facts), labs, courses, library, glossary, approved sites | `src/content/` |
| Library search, live search with allowlist re-check | `src/library/` |
| Reading profile rules (`reading-rules@1.0.0`) and service | `src/reading/` |
| AI gateway (Gemini → Groq, timeout, retry, logging), validator, practice tutor | `src/ai/` |
| Stores: memory and Supabase (REST + `ll_commit` RPC) | `src/store/` |
| HTTP server, routes, sign-in, CSP | `src/server/` |
| Pages (vanilla JS, no build step) | `public/` |
| Database schema with row-level security | `db/migrations/001_core.sql`, `002_video_extras.sql` |

## API

Learner routes identify the learner by cookie (anonymous mode) or
`Authorization: Bearer <Supabase token>`. Instructor routes need
`x-instructor-key` when `INSTRUCTOR_KEY` is set.

| Method and path | Purpose |
| --- | --- |
| `GET /api/config` | Mode, lessons, whether AI and live search are on |
| `GET /api/courses?lang=` · `GET /api/courses/:id` | Catalog (public) and one course with the learner's progress |
| `GET /api/dashboard?lang=` | Continue reading, progress, practice summary, focus areas, receipts |
| `GET /api/profile?lang=` · `GET /api/profile/export` | What the platform learned, with reasons; full data export |
| `POST /api/profile/reset` `{scope}` | `reading` · `practice` · `all` (practice deletion is refused while a sealed check is open) |
| `GET /api/labs/:lessonId?lang=` | The lab for a lesson (no answers) with the learner's progress |
| `POST /api/labs/:lessonId/check` `{checkId, choice, lang}` | Check one lab result; the explanation is returned only when correct |
| `GET /api/lessons/:id?lang=en\|bn&original=1` | Lesson at the learner's level, with terms, extra examples and reasons |
| `POST /api/selection-help` `{lessonId, blockId, text, action, lang, …}` | `action`: `understand` · `search` · `quiz`; optional `prereqAnswer`, `skipPrereq`, `depth`, `variant`, `latest` |
| `POST /api/quiz/check` `{lessonId, blockId, choice, lang}` | Check a quiz answer; updates the profile |
| `POST /api/selection-help/feedback` `{…, value}` | `too_easy` · `just_right` · `too_hard` · `too_long` |
| `POST /api/reading-events` `{events}` | `view`, `active_time`, `scroll_back`, `zoom`, `late_read`, `setting` |
| `POST /api/sessions` … `/receipt` | Practice loop and sealed check (as in Slice 1) |
| `GET /api/instructor/overview` | Class patterns; small groups hidden |
| `POST /api/instructor/seed-demo` | Adds 8 labelled synthetic learners |

## Rules the code enforces (and the tests check)

- Code decides correctness; no model calculates or grades.
- AI text is shown only if it is valid JSON, cites passages it was given, uses no numbers outside the evidence, is in the right language and makes no claims about the learner. Otherwise the reviewed passage is shown.
- Live search asks the provider for approved domains only, then re-checks every URL (https, exact domain or subdomain) before showing it.
- Personalisation changes wording level, term help, extra examples and display suggestions only. Headings, formulas, interactive blocks and facts (numbers, ৳ amounts) are identical in every version. Display changes are suggested, never imposed.
- The profile uses reading evidence only: no personality or learning-style labels. Every change stores a reason in English and Bangla.
- During the sealed check, all help (practice and lessons) is refused on the server.
- Assisted answers never count towards readiness. No answer key appears in any response.
- Class statistics hide groups smaller than `MIN_GROUP_SIZE`; synthetic learners are labelled.

## Optional: type checking

```sh
npm i -D typescript @types/node
npm run typecheck
```

## Known limits

- All lesson and help text is **draft**: it needs subject review, and the Bangla needs a native reviewer.
- Nine lessons across eight courses; the other 13 courses link to their video playlists until lessons are written.
- Lessons are matched to videos by title; nobody has yet checked each lesson against what the video actually says. Simulator menu names in the labs can change when those tools update.
- The memory store resets on restart; use Supabase for anything beyond a local demo.
- No score-improvement evidence yet: that needs a pre/post pilot with real learners.
