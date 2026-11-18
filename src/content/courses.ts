// Course catalog built from the Loop & Logic YouTube playlists.
// A course groups related playlists. Courses with adaptive lessons open in
// the reader; the rest link to the videos until lessons are written.

import type { Bi } from './pricing-pack.ts';

export const CHANNEL = {
  name: 'Loop & Logic',
  url: 'https://www.youtube.com/@loopNlogic',
  site: 'https://loopnlogic.com',
  // Read from the channel page on 15 Nov 2026. Update before each submission.
  subscribers: 6340,
  videos: 501,
  playlists: 30,
  checkedOn: '2026-11-15',
};

export type CourseSubject = 'cse' | 'math' | 'physics' | 'eee' | 'business' | 'science';

export const SUBJECTS: Record<CourseSubject, Bi> = {
  cse: { en: 'Computer science', bn: 'কম্পিউটার সায়েন্স' },
  math: { en: 'Mathematics', bn: 'গণিত' },
  physics: { en: 'Physics', bn: 'পদার্থবিজ্ঞান' },
  eee: { en: 'Electrical & electronics', bn: 'ইলেকট্রিক্যাল ও ইলেকট্রনিক্স' },
  business: { en: 'Business', bn: 'ব্যবসা' },
  science: { en: 'General science', bn: 'সাধারণ বিজ্ঞান' },
};

export interface Playlist { id: string; title: string; videos: number }

export interface Course {
  id: string;
  code: string | null;
  subject: CourseSubject;
  title: Bi;
  blurb: Bi;
  playlists: Playlist[];
  lessons: string[]; // adaptive lesson ids
  practice: boolean; // has the "judge the AI coworker" practice
}

const pl = (id: string, title: string, videos: number): Playlist => ({ id, title, videos });

export const COURSES: Course[] = [
  {
    id: 'machine-learning', code: null, subject: 'cse',
    title: { en: 'Machine Learning', bn: 'মেশিন লার্নিং' },
    blurb: { en: 'Concepts, maths and examples in Bangla, from data to model decisions.', bn: 'বাংলায় ধারণা, গণিত আর উদাহরণ — ডেটা থেকে মডেলের সিদ্ধান্ত পর্যন্ত।' },
    playlists: [pl('PLZrRnQlMJw08', 'Machine Learning in Bangla | Concepts, Math & Examples', 13), pl('PL66eeXZhO4z4j8fCZd7x0MWL08pitnH4Q', 'Data Science & Machine Learning Bangla Tutorial | Full Course', 11)],
    lessons: ['classification-threshold', 'confusion-matrix'], practice: false,
  },
  {
    id: 'basic-accounting', code: null, subject: 'business',
    title: { en: 'Basic Accounting', bn: 'বেসিক অ্যাকাউন্টিং' },
    blurb: { en: 'Cost, price and profit — and how to check an AI’s pricing advice.', bn: 'খরচ, দাম আর লাভ — আর কীভাবে এআই-এর দামের পরামর্শ যাচাই করবে।' },
    playlists: [pl('PL66eeXZhO4z6egM60wj2oDm8WzMY4v1Lw', 'Basic Accounting', 3)],
    lessons: ['margin-basics'], practice: true,
  },
  {
    id: 'artificial-intelligence', code: null, subject: 'cse',
    title: { en: 'Artificial Intelligence', bn: 'আর্টিফিশিয়াল ইন্টেলিজেন্স' },
    blurb: { en: 'Search, reasoning and agents — the full course plus final-exam preparation.', bn: 'সার্চ, রিজনিং আর এজেন্ট — পূর্ণ কোর্স আর ফাইনাল প্রস্তুতি।' },
    playlists: [pl('PL66eeXZhO4z694xbE6GvcQqqJLX_N8cza', 'Artificial Intelligence (AI) Bangla Tutorial | Full Course', 21), pl('PL66eeXZhO4z4gwINt6SRVFFp-xhMyCs_N', 'Artificial Intelligence Final', 14)],
    lessons: [], practice: false,
  },
  {
    id: 'operating-systems', code: null, subject: 'cse',
    title: { en: 'Operating Systems', bn: 'অপারেটিং সিস্টেম' },
    blurb: { en: 'Processes, scheduling, memory and deadlocks, with final-exam solutions.', bn: 'প্রসেস, শিডিউলিং, মেমোরি আর ডেডলক — ফাইনালের সমাধানসহ।' },
    playlists: [pl('PL66eeXZhO4z6069rHpvH3j7sKsi42-lac', 'Operating System (OS) Full Course in Bangla', 20), pl('PL66eeXZhO4z4SaL9H1v_FOjsI3zz92P89', 'OS Final', 12)],
    lessons: ['cpu-scheduling'], practice: false,
  },
  {
    id: 'data-structures', code: null, subject: 'cse',
    title: { en: 'Data Structures', bn: 'ডেটা স্ট্রাকচার' },
    blurb: { en: 'Live classes from Spring 2026, plus arrays in C.', bn: 'স্প্রিং ২০২৬-এর লাইভ ক্লাস, আর সি-তে অ্যারে।' },
    playlists: [pl('PL66eeXZhO4z4Alloq0LhOoXnov8_mvEz0', 'Data Structures Live Class Spring - 2026', 10), pl('PLdy3tDZmQLoc', 'Array in C', 2)],
    lessons: ['stack-queue'], practice: false,
  },
  {
    id: 'algorithms', code: null, subject: 'cse',
    title: { en: 'Algorithms', bn: 'অ্যালগরিদম' },
    blurb: { en: 'Sorting, searching, graphs and complexity.', bn: 'সর্টিং, সার্চিং, গ্রাফ আর কমপ্লেক্সিটি।' },
    playlists: [pl('PL66eeXZhO4z6y7NDo_jAEd9RYy8TfYgB7', 'Algorithm', 11)],
    lessons: ['euclid-gcd'], practice: false,
  },
  {
    id: 'discrete-math', code: null, subject: 'math',
    title: { en: 'Discrete Mathematics', bn: 'ডিসক্রিট ম্যাথমেটিক্স' },
    blurb: { en: 'Logic, sets, relations and counting, in two series.', bn: 'লজিক, সেট, রিলেশন আর গণনা — দুই সিরিজে।' },
    playlists: [pl('PL66eeXZhO4z6epJkdJnHNY6swkIZG7sRH', 'Discrete Mathematics', 10), pl('PLRxmKODZHZdY', 'Discrete Mathematics 2.0', 11)],
    lessons: ['propositional-logic'], practice: false,
  },
  {
    id: 'theory-of-computation', code: null, subject: 'cse',
    title: { en: 'Theory of Computation', bn: 'থিওরি অব কম্পিউটেশন' },
    blurb: { en: 'Automata and languages for the mid-term.', bn: 'মিড-টার্মের জন্য অটোমাটা আর ল্যাঙ্গুয়েজ।' },
    playlists: [pl('PLaneiiW1yIwA', 'TOC MID TERM', 7)],
    lessons: [], practice: false,
  },
  {
    id: 'software-engineering', code: null, subject: 'cse',
    title: { en: 'Software Engineering', bn: 'সফটওয়্যার ইঞ্জিনিয়ারিং' },
    blurb: { en: 'Process models, requirements and design.', bn: 'প্রসেস মডেল, রিকোয়ারমেন্ট আর ডিজাইন।' },
    playlists: [pl('PL66eeXZhO4z7F__j9fnTgOajGUmo8nzuu', 'SWE', 7)],
    lessons: [], practice: false,
  },
  {
    id: 'computer-fundamentals', code: null, subject: 'cse',
    title: { en: 'Computer Fundamentals', bn: 'কম্পিউটার ফান্ডামেন্টালস' },
    blurb: { en: 'Number systems, hardware and the basics every CSE student needs.', bn: 'সংখ্যা পদ্ধতি, হার্ডওয়্যার আর প্রতিটি সিএসই শিক্ষার্থীর দরকারি মূল বিষয়।' },
    playlists: [pl('PL66eeXZhO4z6_OfsZzit4MHDnZFEYsvRP', 'Computer Fundamental', 24)],
    lessons: [], practice: false,
  },
  {
    id: 'problem-solving', code: null, subject: 'cse',
    title: { en: 'Problem Solving (Beecrowd)', bn: 'প্রবলেম সলভিং (বিক্রাউড)' },
    blurb: { en: 'Worked Beecrowd problems, step by step.', bn: 'ধাপে ধাপে বিক্রাউড সমস্যার সমাধান।' },
    playlists: [pl('PLUYyHYU-qzUU', 'Beecrowd Problem Solving', 8)],
    lessons: [], practice: false,
  },
  {
    id: 'digital-logic', code: null, subject: 'cse',
    title: { en: 'Digital Logic Design', bn: 'ডিজিটাল লজিক ডিজাইন' },
    blurb: { en: 'Gates, Boolean algebra and simplification.', bn: 'গেট, বুলিয়ান অ্যালজেবরা আর সরলীকরণ।' },
    playlists: [pl('PLDrZyglXC0_I', 'Digital Logic Design', 4)],
    lessons: ['logic-gates'], practice: false,
  },
  {
    id: 'mat-101', code: 'MAT-101', subject: 'math',
    title: { en: 'Mathematics I', bn: 'গণিত ১' },
    blurb: { en: 'The DIU first-semester maths course.', bn: 'ডিআইইউ প্রথম সেমিস্টারের গণিত কোর্স।' },
    playlists: [pl('PLKI11uRhyWyo', 'MAT-101', 12)],
    lessons: [], practice: false,
  },
  {
    id: 'mat-102', code: 'MAT-102', subject: 'math',
    title: { en: 'Mathematics II', bn: 'গণিত ২' },
    blurb: { en: 'The DIU second maths course.', bn: 'ডিআইইউ দ্বিতীয় গণিত কোর্স।' },
    playlists: [pl('PL66eeXZhO4z7a-pM3YV38JP5f5U1rofBw', 'MAT-102 (MAT102) | DIU', 17)],
    lessons: [], practice: false,
  },
  {
    id: 'engineering-math', code: null, subject: 'math',
    title: { en: 'Engineering Mathematics', bn: 'ইঞ্জিনিয়ারিং ম্যাথমেটিক্স' },
    blurb: { en: 'Core methods for engineering courses.', bn: 'ইঞ্জিনিয়ারিং কোর্সের মূল পদ্ধতি।' },
    playlists: [pl('PL66eeXZhO4z40zsmGF1svBVHtvCVSJUZL', 'Engineering Mathematics', 5)],
    lessons: [], practice: false,
  },
  {
    id: 'phy-101', code: 'PHY-101', subject: 'physics',
    title: { en: 'Physics I', bn: 'পদার্থবিজ্ঞান ১' },
    blurb: { en: 'The DIU first physics course.', bn: 'ডিআইইউ প্রথম পদার্থবিজ্ঞান কোর্স।' },
    playlists: [pl('PL66eeXZhO4z4wFFpXCW6vbegJxBcaYz-n', 'PHY-101 (PHY101) | DIU', 12)],
    lessons: [], practice: false,
  },
  {
    id: 'phy-102', code: 'PHY-102', subject: 'physics',
    title: { en: 'Physics II', bn: 'পদার্থবিজ্ঞান ২' },
    blurb: { en: 'The DIU second physics course.', bn: 'ডিআইইউ দ্বিতীয় পদার্থবিজ্ঞান কোর্স।' },
    playlists: [pl('PL66eeXZhO4z6V0_URcjkELL-J-8GZTjfJ', 'PHY-102', 14)],
    lessons: [], practice: false,
  },
  {
    id: 'electric-circuits', code: null, subject: 'eee',
    title: { en: 'Electric Circuits', bn: 'ইলেকট্রিক সার্কিট' },
    blurb: { en: 'DC and AC circuit analysis, lab work and final preparation.', bn: 'ডিসি ও এসি সার্কিট বিশ্লেষণ, ল্যাব আর ফাইনাল প্রস্তুতি।' },
    playlists: [pl('PL66eeXZhO4z7zxrEROpPg7HvBrQ-afEHs', 'Electric Circuits Bangla Tutorial | DC & AC', 26), pl('PLeWFoKcHbhAg', 'EC Final', 8), pl('PL66eeXZhO4z7DqidWoQjJpd-QC7DoO2xD', 'Electric Circuits Lab', 2)],
    lessons: ['ohms-law'], practice: false,
  },
  {
    id: 'electronic-devices', code: null, subject: 'eee',
    title: { en: 'Electronic Devices and Circuits', bn: 'ইলেকট্রনিক ডিভাইস ও সার্কিট' },
    blurb: { en: 'Diodes, transistors and question solutions.', bn: 'ডায়োড, ট্রানজিস্টর আর প্রশ্নের সমাধান।' },
    playlists: [pl('PLLpPXGmhoSA0', 'Electronic Devices and Circuits Bangla | EDC', 7)],
    lessons: [], practice: false,
  },
  {
    id: 'instrumentation-control', code: null, subject: 'eee',
    title: { en: 'Instrumentation and Control', bn: 'ইনস্ট্রুমেন্টেশন ও কন্ট্রোল' },
    blurb: { en: 'Measurement and control systems, with final preparation.', bn: 'পরিমাপ ও নিয়ন্ত্রণ ব্যবস্থা — ফাইনাল প্রস্তুতিসহ।' },
    playlists: [pl('PL66eeXZhO4z7sZtR9PMHy41ipvrUp5jSD', 'Instrumental and Control', 19), pl('PLJ_Ql24cr4dw', 'IC Final', 6)],
    lessons: [], practice: false,
  },
  {
    id: 'biology-chemistry', code: null, subject: 'science',
    title: { en: 'Introduction to Biology and Chemistry', bn: 'জীববিজ্ঞান ও রসায়নের ভূমিকা' },
    blurb: { en: 'Foundations for non-major science courses.', bn: 'নন-মেজর বিজ্ঞান কোর্সের ভিত্তি।' },
    playlists: [pl('PL66eeXZhO4z65dn52igceukP7BfnG6PZV', 'Introduction to Biology and Chemistry', 7)],
    lessons: [], practice: false,
  },
];

export const getCourse = (id: string) => COURSES.find((c) => c.id === id);
export const courseForLesson = (lessonId: string) => COURSES.find((c) => c.lessons.includes(lessonId));
export const playlistUrl = (id: string) => `https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`;
