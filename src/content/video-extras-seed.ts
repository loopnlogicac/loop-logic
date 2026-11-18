// Materials, quizzes and Try now settings that ship with the site, keyed by
// YouTube video id. Content saved by instructors on the site overrides these.
//
// While the site runs without a database, saved content is lost on restart.
// To keep it: Instructor → "Export video materials" downloads a JSON file;
// paste its "videos" object below and commit.

export const SEED_EXTRAS: Record<string, unknown> = {};
