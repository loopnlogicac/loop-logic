raw = "  CSE101, MAT101, CSE101  "
courses = [part.strip() for part in raw.strip().split(",")]
print(courses)
print(" | ".join(courses))
print(raw.replace("CSE101", "CSE102", 1).strip())
print(raw.find("MAT"), raw.find("EEE"))
