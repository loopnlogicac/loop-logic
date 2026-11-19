from dataclasses import dataclass


@dataclass(frozen=True)
class Entry:
    name: str
    type_name: str
    depth: int
    slot: int


class Symbols:
    def __init__(self):
        self.scopes = [{}]
        self.next_slots = [0]

    def enter(self):
        self.scopes.append({})
        self.next_slots.append(0)

    def leave(self):
        if len(self.scopes) == 1:
            raise ValueError("cannot leave global scope")
        self.scopes.pop()
        self.next_slots.pop()

    def declare(self, name, type_name):
        current = self.scopes[-1]
        if name in current:
            raise ValueError(f"duplicate: {name}")
        entry = Entry(name, type_name, len(self.scopes) - 1, self.next_slots[-1])
        current[name] = entry
        self.next_slots[-1] += 1
        return entry

    def lookup(self, name):
        for scope in reversed(self.scopes):
            if name in scope:
                return scope[name]
        raise ValueError(f"undeclared: {name}")


import sys


if __name__ == "__main__":
    print("Braces:")
    symbols = Symbols()
    maximum = 0
    valid = True
    for char in sys.stdin.read():
        if char == "{":
            symbols.enter()
            maximum = max(maximum, len(symbols.scopes) - 1)
        elif char == "}":
            try:
                symbols.leave()
            except ValueError:
                valid = False
                break
        elif not char.isspace():
            valid = False
            break
    print(maximum if valid and len(symbols.scopes) == 1 else "invalid")
