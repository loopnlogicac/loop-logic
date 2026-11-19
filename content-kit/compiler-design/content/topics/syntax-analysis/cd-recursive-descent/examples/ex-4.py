class ParseError(Exception):
    pass


def tokenize(text):
    tokens = []
    position = 0
    while position < len(text):
        char = text[position]
        if char.isspace():
            position += 1
        elif char.isascii() and char.isdigit():
            end = position + 1
            while end < len(text) and text[end].isascii() and text[end].isdigit():
                end += 1
            tokens.append(("NUM", int(text[position:end]), position))
            position = end
        elif char in "+-*();":
            tokens.append((char, char, position))
            position += 1
        else:
            raise ParseError(f"column {position + 1}: unknown character {char!r}")
    tokens.append(("EOF", "", len(text)))
    return tokens


class Parser:
    def __init__(self, text):
        self.tokens = tokenize(text)
        self.position = 0

    def kind(self):
        return self.tokens[self.position][0]

    def take(self, kind):
        token = self.tokens[self.position]
        if token[0] != kind:
            raise ParseError(f"column {token[2] + 1}: expected {kind}, found {token[0]}")
        self.position += 1
        return token[1]

    def expression(self):
        value = self.term()
        while self.kind() in ("+", "-"):
            operator = self.kind()
            self.take(operator)
            right = self.term()
            value = value + right if operator == "+" else value - right
        return value

    def term(self):
        value = self.factor()
        while self.kind() == "*":
            self.take("*")
            value *= self.factor()
        return value

    def factor(self):
        if self.kind() == "NUM":
            return self.take("NUM")
        self.take("(")
        value = self.expression()
        self.take(")")
        return value

    def program(self):
        results, errors = [], []
        while self.kind() != "EOF":
            try:
                value = self.expression()
                self.take(";")
                results.append(value)
            except ParseError as error:
                errors.append(str(error))
                while self.kind() not in (";", "EOF"):
                    self.position += 1
                if self.kind() == ";":
                    self.position += 1
        return results, errors




if __name__ == "__main__":
    try:
        parser = Parser("2@3;")
        print(parser.program())
    except ParseError as error:
        print(error)
