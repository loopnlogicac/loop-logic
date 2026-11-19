# Natural Bangla for Loop & Logic

**Applies to every track, from round 3 (19 Nov 2026).** Read this before writing any `bn` text: titles, summaries, key points, `body.bn.html`, lab notes and figure captions.

## The one rule

**Write Bangla the way a good Bangladeshi teacher speaks in class.** Bangladeshi students say "লুপটা পাঁচবার চলবে", "মডেলটা ট্রেনিং ডেটা থেকে শেখে" and "ক্লাউডে রাখো". They never say "পুনরাবৃত্তি কাঠামোটি পাঁচবার চলিবে" or "যন্ত্র শিক্ষণ" or "মেঘে রাখো".

Technical words that came from English **stay English**:
- **Common words** (computer, program, data, function, loop, array, model, cloud, machine learning…): write them **in Bangla script**, as people say them: কম্পিউটার, প্রোগ্রাম, ডেটা, ফাংশন, লুপ, অ্যারে, মডেল, ক্লাউড, মেশিন লার্নিং.
- **Code, keywords, identifiers, file names, and rarer terms** (`printf`, `for`, `head`, `NULL`, `train_test_split`, overfitting, gradient descent, LL(1)): keep them **in English letters**. Add a short Bangla explanation the first time a term appears.
- **Everything else** is plain, everyday চলিত Bangla: short sentences, তুমি for the reader, no সাধু forms (হইবে, করিয়া, তাহা).

## Use this, not that

The checker reports an **error** for the words marked ✗ and a **warning** for ⚠ (warnings are words that are sometimes fine in everyday meaning; use them only in that meaning).

| English term | Write | Never write |
|---|---|---|
| machine learning | মেশিন লার্নিং | ✗ যন্ত্র শিক্ষণ, যন্ত্রশিক্ষণ, যান্ত্রিক শিখন |
| machine | মেশিন | ⚠ যন্ত্র |
| artificial intelligence | এআই (কৃত্রিম বুদ্ধিমত্তা once, as an explanation, is fine) | |
| cloud | ক্লাউড | ✗ মেঘ কম্পিউটিং, মেঘ প্রযুক্তি |
| computer | কম্পিউটার | ✗ সংগণক, গণকযন্ত্র |
| program, programming | প্রোগ্রাম, প্রোগ্রামিং | ✗ ক্রমলেখ, ক্রমলিখন |
| data | ডেটা | ✗ উপাত্ত |
| database | ডেটাবেস | ✗ তথ্যভাণ্ডার, তথ্যভান্ডার |
| variable | ভেরিয়েবল | ✗ চলক |
| constant | কনস্ট্যান্ট (or `const`) | ⚠ ধ্রুবক |
| function | ফাংশন | ✗ অপেক্ষক |
| pointer | পয়েন্টার | ✗ নির্দেশক |
| array | অ্যারে | ⚠ বিন্যাস |
| loop | লুপ | ✗ পুনরাবৃত্তি কাঠামো, আবর্তন কাঠামো |
| recursion | রিকার্শন | ✗ পুনরাবৃত্তি ফাংশন |
| class, object | ক্লাস, অবজেক্ট | ⚠ শ্রেণি, বস্তু |
| inheritance | ইনহেরিট্যান্স | ⚠ উত্তরাধিকার |
| polymorphism | পলিমরফিজম | ✗ বহুরূপতা |
| encapsulation | এনক্যাপসুলেশন | ✗ আবদ্ধকরণ |
| compiler | কম্পাইলার | ✗ সংকলক |
| interpreter | ইন্টারপ্রেটার | ✗ দোভাষী প্রোগ্রাম |
| stack, queue, tree, graph, heap, hash table | স্ট্যাক, কিউ, ট্রি, গ্রাফ, হিপ, হ্যাশ টেবিল | ✗ লেখচিত্র; ⚠ স্তূপ, বৃক্ষ (and সারি only for a table row, never for a queue) |
| cluster | ক্লাস্টার | ⚠ স্তূপ, গুচ্ছ |
| algorithm | অ্যালগরিদম | ✗ কলনবিধি |
| instruction, symbol, token | ইনস্ট্রাকশন, সিম্বল, টোকেন | ⚠ নির্দেশনা, প্রতীক |
| feature, label, training, test, accuracy | ফিচার, লেবেল, ট্রেনিং, টেস্ট, অ্যাকুরেসি | |
| input, output, memory, file, server, browser | ইনপুট, আউটপুট, মেমরি, ফাইল, সার্ভার, ব্রাউজার | |

Everyday Bangla words are welcome where they are natural and exact: মান (value), শর্ত (condition), ধাপ, উদাহরণ, প্রশ্ন, উত্তর, ভুল, যোগ, গুণ, ফলাফল, সারি ও কলাম (rows and columns of a table).

## Examples

| Unnatural | Natural |
|---|---|
| যন্ত্র শিক্ষণে উপাত্ত থেকে নিয়ম শেখা হয়। | মেশিন লার্নিংয়ে মডেল ডেটা থেকে নিজেই নিয়ম শেখে। |
| চলকের মান পুনরাবৃত্তি কাঠামোর প্রতিটি আবর্তনে বৃদ্ধি পায়। | লুপ যতবার ঘোরে, ভেরিয়েবলটার মান ততবার ১ করে বাড়ে। |
| নির্দেশকটি বিন্যাসের প্রথম উপাদানকে নির্দেশ করে। | পয়েন্টারটা অ্যারের প্রথম এলিমেন্টের দিকে তাক করা আছে। |
| স্তূপের সংখ্যা নির্ধারণ করতে কনুই পদ্ধতি ব্যবহার করো। | কয়টা ক্লাস্টার নেবে, তা ঠিক করতে elbow method দেখো। |
| মেঘে তথ্যভাণ্ডার রাখা হয়। | ডেটাবেসটা ক্লাউডে রাখা আছে। |

## Checks before you finish

- Read every Bangla sentence aloud. Would a Dhaka university teacher say it like that in class? If not, rewrite it.
- Translate the meaning, never word by word. The Bangla may be shorter or longer than the English.
- One English term, one spelling, across the whole track (ফাংশন everywhere, not ফাংশন in one topic and ফাঙ্কশন in another).
- In round 3, also fix the Bangla in your track's **earlier topics** where this guide says so. The checker shows you where.
