from dataclasses import dataclass


class LanguageError(ValueError):
    pass


@dataclass(frozen=True)
class Token:
    kind: str
    text: str
    line: int
    column: int


@dataclass(frozen=True)
class Node:
    op: str
    value: str = ""
    children: tuple = ()


def scan(source):
    tokens = []
    index, line, column = 0, 1, 1
    while index < len(source):
        char = source[index]
        if char.isspace():
            if char == "\n":
                line, column = line + 1, 1
            else:
                column += 1
            index += 1
            continue
        start, start_column = index, column
        if "0" <= char <= "9":
            while index < len(source) and "0" <= source[index] <= "9":
                index += 1
            kind = "number"
        elif char.isascii() and (char.isalpha() or char == "_"):
            while index < len(source):
                part = source[index]
                if not (part.isascii() and (part.isalnum() or part == "_")):
                    break
                index += 1
            kind = "name"
        elif char in "+-*()":
            index += 1
            kind = char
        else:
            raise LanguageError(f"line {line}, column {column}: unexpected {char!r}")
        text = source[start:index]
        tokens.append(Token(kind, text, line, start_column))
        column += index - start
    tokens.append(Token("end", "", line, column))
    return tokens


class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.position = 0

    def peek(self):
        return self.tokens[self.position]

    def take(self, kind):
        token = self.peek()
        if token.kind != kind:
            found = token.text or "end of input"
            raise LanguageError(
                f"line {token.line}, column {token.column}: expected {kind}, got {found}"
            )
        self.position += 1
        return token

    def parse(self):
        result = self.expression()
        self.take("end")
        return result

    def expression(self):
        result = self.term()
        while self.peek().kind in ("+", "-"):
            operator = self.peek().kind
            self.take(operator)
            result = Node(operator, children=(result, self.term()))
        return result

    def term(self):
        result = self.unary()
        while self.peek().kind == "*":
            self.take("*")
            result = Node("*", children=(result, self.unary()))
        return result

    def unary(self):
        if self.peek().kind == "-":
            self.take("-")
            return Node("neg", children=(self.unary(),))
        if self.peek().kind == "(":
            self.take("(")
            result = self.expression()
            self.take(")")
            return result
        if self.peek().kind == "number":
            return Node("number", self.take("number").text)
        if self.peek().kind == "name":
            return Node("name", self.take("name").text)
        token = self.peek()
        raise LanguageError(
            f"line {token.line}, column {token.column}: expected an operand"
        )


def parse(source):
    return Parser(scan(source)).parse()


def evaluate(node, environment=None):
    environment = {} if environment is None else environment
    if node.op == "number":
        return int(node.value)
    if node.op == "name":
        if node.value not in environment:
            raise LanguageError(f"unknown name: {node.value}")
        return environment[node.value]
    left = evaluate(node.children[0], environment)
    if node.op == "neg":
        return -left
    right = evaluate(node.children[1], environment)
    return {"+": lambda: left + right, "-": lambda: left - right,
            "*": lambda: left * right}[node.op]()


def annotate(node, environment=None):
    rows = []

    def visit(current):
        for child in current.children:
            visit(child)
        rows.append((current.op, current.value or "-", evaluate(current, environment)))

    visit(node)
    return rows


def generate_tac(node):
    rows = []
    names = set()

    def collect(current):
        if current.op == "name":
            names.add(current.value)
        for child in current.children:
            collect(child)

    collect(node)
    counter = 0

    def emit(current):
        nonlocal counter
        if current.op in ("number", "name"):
            return current.value
        operands = [emit(child) for child in current.children]
        counter += 1
        while f"t{counter}" in names:
            counter += 1
        result = f"t{counter}"
        rows.append((current.op, operands[0], operands[1] if len(operands) > 1 else "-",
                     result))
        return result

    return rows, emit(node)


def print_tac(node):
    rows, result = generate_tac(node)
    for operator, left, right, target in rows:
        text = f"-{left}" if operator == "neg" else f"{left} {operator} {right}"
        print(f"{target} = {text}")
    print(f"result = {result}")


import sys


if __name__ == "__main__":
    print("Expression for TAC:")
    try:
        print_tac(parse(sys.stdin.read()))
    except (LanguageError, RecursionError):
        print("invalid")
