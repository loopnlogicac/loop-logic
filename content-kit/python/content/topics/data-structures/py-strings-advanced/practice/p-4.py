fields = [field.strip() for field in input().split(",")]
print(";".join(field for field in fields if field))
