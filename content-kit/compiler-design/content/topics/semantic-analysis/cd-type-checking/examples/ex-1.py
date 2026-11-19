NUMERIC = {"int", "real"}


def type_of(expression, environment):
    tag, *parts = expression
    if tag == "lit":
        value = parts[0]
        # bool is a subclass of int in Python; the source language separates them.
        if type(value) is bool:
            return "bool"
        if type(value) is int:
            return "int"
        if type(value) is float:
            return "real"
        raise TypeError("unsupported literal")
    if tag == "var":
        if parts[0] not in environment:
            raise TypeError(f"undeclared: {parts[0]}")
        return environment[parts[0]]
    if tag == "add":
        left = type_of(parts[0], environment)
        right = type_of(parts[1], environment)
        if left not in NUMERIC or right not in NUMERIC:
            raise TypeError("addition needs numeric operands")
        return "real" if "real" in (left, right) else "int"
    if tag == "lt":
        left = type_of(parts[0], environment)
        right = type_of(parts[1], environment)
        if left not in NUMERIC or right not in NUMERIC:
            raise TypeError("comparison needs numeric operands")
        return "bool"
    if tag == "index":
        array_type = type_of(parts[0], environment)
        index_type = type_of(parts[1], environment)
        if not isinstance(array_type, tuple) or array_type[0] != "array":
            raise TypeError("indexing needs an array")
        if index_type != "int":
            raise TypeError("index must be int")
        return array_type[2]
    raise TypeError(f"unknown expression: {tag}")


def conversion(source_type, target_type):
    if source_type == target_type:
        return "identity"
    if source_type == "int" and target_type == "real":
        return "int-to-real"
    raise TypeError(f"cannot assign {source_type} to {target_type}")


if __name__ == "__main__":
    environment = {"marks": "int", "bonus": "real", "scores": ("array", 3, "int")}
    expressions = [
        ("add", ("var", "marks"), ("var", "bonus")),
        ("lt", ("var", "marks"), ("lit", 60)),
        ("index", ("var", "scores"), ("lit", 1)),
        ("add", ("lit", True), ("lit", 1)),
        ("var", "missing"),
        ("index", ("var", "scores"), ("lit", False)),
    ]
    for expression in expressions:
        try:
            print(type_of(expression, environment))
        except TypeError as error:
            print(f"error: {error}")
