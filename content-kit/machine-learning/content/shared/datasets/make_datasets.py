"""Rebuild the six invented, offline course datasets beside this script."""
import csv
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parent


def save(name, columns, rows):
    """Use explicit UTF-8 and LF so regeneration is byte-for-byte stable."""
    with (ROOT / name).open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(columns)
        writer.writerows(rows)


def main():
    rng = np.random.default_rng(2026)
    tiny = [
        [2, 3, "apple"], [3, 2, "apple"], [3, 4, "apple"],
        [4, 3, "apple"], [5, 5, "apple"], [6, 7, "mango"],
        [7, 8, "mango"], [8, 7, "mango"], [7, 6, "mango"],
        [6, 9, "mango"],
    ]
    save("tiny_fruits.csv", ["size_cm", "sweetness", "label"], tiny)

    fruits = []
    for label, size, weight, sweet, colour in [
        ("apple", 6.5, 160, 5.5, 3),
        ("mango", 9, 270, 8, 7),
        ("lychee", 3, 22, 8.5, 5),
    ]:
        for _ in range(40):
            fruits.append([
                round(float(np.clip(rng.normal(size, 0.7), 1, 14)), 1),
                round(float(max(8, rng.normal(weight, weight * 0.12))), 1),
                round(float(np.clip(rng.normal(sweet, 0.8), 0, 10)), 1),
                round(float(np.clip(rng.normal(colour, 0.9), 0, 10)), 1),
                label,
            ])
    rng.shuffle(fruits)
    save("fruits.csv", ["size_cm", "weight_g", "sweetness", "colour_score", "label"], fruits)

    study = []
    for i in range(200):
        hours = round(float(rng.uniform(0, 8)), 1)
        attendance = int(rng.integers(40, 101))
        past = int(rng.integers(20, 96))
        sleep = round(float(rng.uniform(4, 9)), 1)
        marks = round(float(np.clip(
            8 + 5 * hours + 0.16 * attendance + 0.3 * past
            + 1.2 * (sleep - 6) + rng.normal(0, 8), 0, 100
        )), 1)
        study.append([hours, attendance, past, sleep, int(marks >= 50), marks])
    for i, j in [(7, 0), (24, 1), (59, 2), (103, 3), (155, 0), (181, 3)]:
        study[i][j] = ""
    # Deliberate impossible measurement, for the cleaning lesson to investigate.
    study[199][0] = 30
    save("study.csv", ["hours_studied", "attendance_pct", "past_marks",
                       "sleep_hours", "passed", "marks"], study)

    districts = ["Mirpur", "Dhanmondi", "Uttara", "Mohammadpur", "Badda"]
    premiums = [0, 8000, 4500, 1200, -1000]
    rent = []
    for i in range(250):
        area = int(rng.integers(500, 2201))
        rooms = max(1, min(5, round(area / 450)))
        floor = int(rng.integers(0, 13))
        distance = round(float(rng.uniform(0.5, 15)), 1)
        district = i % 5
        price = max(6000, round((5000 + 14 * area + 1800 * rooms
                               + 200 * floor - 350 * distance
                               + premiums[district] + rng.normal(0, 2200)) / 100) * 100)
        rent.append([area, rooms, floor, distance, districts[district], price])
    for i, j in [(3, 0), (42, 3), (75, 2), (121, 4), (198, 0), (211, 3)]:
        rent[i][j] = ""
    rent[249][-1] = 500000
    save("rent.csv", ["area_sqft", "rooms", "floor", "distance_km", "district", "rent_bdt"], rent)

    # Combinations are original fictional messages; some vocabulary overlaps classes.
    spam_en = [
        "Claim a surprise prize", "Collect your free reward", "Win bonus tokens now",
        "Unlock a secret gift", "Send a fee to claim winnings", "Get a lucky coupon",
        "Hurry for a cash offer", "You were picked for a reward",
    ]
    spam_bn = [
        "অচেনা পুরস্কার নিতে ফি পাঠান", "গোপন উপহার জেতার সুযোগ",
        "এখনই ফ্রি বোনাস দাবি করুন", "লাকি কুপন নিতে দ্রুত লিখুন",
        "নগদ পুরস্কার পেতে টাকা দিন", "বিশেষ অফারে আজই জিতুন",
        "বিনা আবেদনে আপনিই বিজয়ী", "উপহার পেতে গোপন কোড পাঠান",
    ]
    ham_en = [
        "Bring the library book", "Our class meets after lunch", "Please check the homework",
        "Your parcel is at the desk", "We saved your cricket bat", "The meeting starts soon",
        "Your free library card is ready", "The school prize list is on the board",
    ]
    ham_bn = [
        "আজ খাতাটা নিয়ে এসো", "বিকেলে মাঠে অনুশীলন হবে", "লাইব্রেরির বই ফেরত দিও",
        "তোমার টিফিন বাক্স এখানে আছে", "আগামীকাল ক্লাস একটু আগে", "বাড়ি পৌঁছে খবর দিও",
        "স্কুলের পুরস্কার নিতে এসো", "ফ্রি পাঠচক্রে তোমাকে স্বাগতম",
    ]
    sms = []
    times_en = ["today", "this week", "before evening", "in the morning", "on Friday"]
    times_bn = ["আজ", "এই সপ্তাহে", "সন্ধ্যার আগে", "সকালে", "শুক্রবার"]
    for label, en, bn in [("spam", spam_en, spam_bn), ("ham", ham_en, ham_bn)]:
        for i in range(40):
            sms.append([f"{en[i % 8]} {times_en[i // 8]}.", label])
            sms.append([f"{bn[i % 8]} {times_bn[i // 8]}।", label])
    rng.shuffle(sms)
    save("sms.csv", ["text", "label"], sms)

    shop = []
    for i in range(180):
        group = i % 3
        visits = max(1, int(round(rng.normal([2, 7, 13][group], 1.2))))
        spend = round(float(max(80, rng.normal([350, 1600, 750][group], 130))), 1)
        items = round(float(max(1, rng.normal([2, 7, 4][group], 0.8))), 1)
        online = round(float(np.clip(rng.normal([0.15, 0.6, 0.35][group], 0.12), 0, 1)), 2)
        shop.append([f"C{i + 1:03d}", visits, spend, items, online])
    shop[179][2] = 18000.0
    save("shop.csv", ["customer_id", "visits_per_month", "avg_spend_bdt",
                      "items_per_visit", "online_share"], shop)
    print("Rebuilt tiny_fruits (10), fruits (120), study (200), rent (250), sms (160), shop (180).")


if __name__ == "__main__":
    main()
