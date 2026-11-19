from datetime import date, datetime, timedelta, timezone


def main():
    start = date(2026, 2, 27)
    due = start + timedelta(days=3)
    print(due.isoformat())
    print((due - start).days)
    instant = datetime(2026, 11, 19, 9, 30, tzinfo=timezone.utc)
    dhaka = timezone(timedelta(hours=6))
    print(instant.astimezone(dhaka).isoformat())


if __name__ == "__main__":
    main()
