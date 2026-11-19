"""Check the published automata tables against independent language properties.

Run from any working directory with Python 3.10 or later. No files are modified.
"""
from html.parser import HTMLParser
from itertools import product
from pathlib import Path
import re
import runpy

PACKAGE = Path(__file__).resolve().parents[1]


class TableReader(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables = []
        self.table = None
        self.row = None
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.table = []
        elif tag == "tr":
            self.row = []
        elif tag in {"td", "th"}:
            self.cell = ""

    def handle_data(self, data):
        if self.cell is not None:
            self.cell += data

    def handle_endtag(self, tag):
        if tag in {"td", "th"}:
            self.row.append(self.cell.strip())
            self.cell = None
        elif tag == "tr":
            self.table.append(self.row)
            self.row = None
        elif tag == "table":
            self.tables.append(self.table)
            self.table = None


def tables(topic):
    paths = list((PACKAGE / "topics").glob(f"*/{topic}/body.en.html"))
    assert len(paths) == 1, topic
    reader = TableReader()
    reader.feed(paths[0].read_text(encoding="utf-8"))
    return reader.tables


def words(limit=9):
    for length in range(limit + 1):
        for symbols in product("ab", repeat=length):
            yield "".join(symbols)


def members(cell):
    return {int(value) for value in re.findall(r"\d+", cell)}


def nfa_accepts(rows, start, final, word, epsilon=False):
    graph = {int(row[0]): row[1:] for row in rows[1:]}

    def closure(states):
        result = set(states)
        if epsilon:
            pending = list(result)
            while pending:
                state = pending.pop()
                unseen = members(graph[state][2]) - result
                result.update(unseen)
                pending.extend(unseen)
        return result

    active = closure({start})
    for char in word:
        targets = set()
        for state in active:
            targets.update(members(graph[state]["ab".index(char)]))
        active = closure(targets)
    return final in active


def dfa_accepts(rows, word, name_column=0, a_column=1, b_column=2, final_column=3):
    graph = {row[name_column].split(",")[0]: row for row in rows[1:]}
    state = rows[1][name_column].split(",")[0]
    for char in word:
        state = graph[state][a_column if char == "a" else b_column]
    return graph[state][final_column] == "Yes"


def verify_automata():
    thompson = tables("cd-thompson-construction")[2]
    subset = tables("cd-subset-construction")
    minimisation = tables("cd-dfa-minimization")
    checked = 0
    for word in words():
        assert nfa_accepts(thompson, 0, 9, word, True) == word.endswith("a"), word
        expected = word.endswith("ab")
        assert nfa_accepts(subset[0], 0, 3, word, True) == expected, word
        assert dfa_accepts(subset[3], word, a_column=2, b_column=3,
                           final_column=4) == expected, word
        assert dfa_accepts(minimisation[0], word) == expected, word
        assert dfa_accepts(minimisation[4], word, a_column=2, b_column=3,
                           final_column=4) == expected, word
        checked += 1
    # Verify every claimed quotient block preserves the entire published transition relation.
    original = {row[0].split(",")[0]: row for row in minimisation[0][1:]}
    quotient = minimisation[4][1:]
    blocks = {state: row[0].split(",")[0] for row in quotient
              for state in re.findall(r"[A-Z]", row[1])}
    assert set(blocks) == {"A", "B", "C", "D", "E", "G"}
    for row in quotient:
        for state in re.findall(r"[A-Z]", row[1]):
            assert blocks[original[state][1]] == row[2]
            assert blocks[original[state][2]] == row[3]
            assert original[state][3] == row[4]
    print(f"Automata: {checked} words, five published recognisers agree with suffix properties.")
    print("Minimisation: all reachable quotient memberships and transitions preserve the table.")


def verify_implementations():
    base = PACKAGE / "topics/lexical-analysis"
    parity = runpy.run_path(str(base / "cd-finite-automata/examples/ex-1.py"))["accepts"]
    nfa = runpy.run_path(str(base / "cd-finite-automata/examples/ex-3.py"))["accepts"]
    checked = 0
    for word in words():
        assert parity(word) == (word.count("b") % 2 == 0), word
        assert nfa(word) == word.endswith("ab"), word
        checked += 1
    assert not parity("abx")
    lexer = runpy.run_path(str(base / "cd-lexer-implementation/examples/ex-1.py"))
    tokenize = lexer["tokenize"]
    assert list(tokenize("")) == [("EOF", "", 1, 1)]
    assert list(tokenize("//hi")) == [("EOF", "", 1, 5)]
    assert list(tokenize("@@")) == [
        ("ERROR", "@", 1, 1), ("ERROR", "@", 1, 2), ("EOF", "", 1, 3)]
    assert list(tokenize("x===y;")) == [
        ("ID", "x", 1, 1), ("EQ", "==", 1, 2), ("ASSIGN", "=", 1, 4),
        ("ID", "y", 1, 5), ("SEMI", ";", 1, 6), ("EOF", "", 1, 7)]
    assert list(tokenize("\tprint2 12roll / // @\n১২")) == [
        ("ID", "print2", 1, 2), ("INT", "12", 1, 9), ("ID", "roll", 1, 11),
        ("SLASH", "/", 1, 16), ("ERROR", "১", 2, 1), ("ERROR", "২", 2, 2),
        ("EOF", "", 2, 3)]
    for value in range(200):
        # Construct the expected records from known tokens and positions, without scanning.
        name = f"roll_{value}"
        token_spellings = [("LET", "let"), ("ID", name), ("ASSIGN", "="),
                           ("INT", str(value)), ("SEMI", ";")]
        column = 1
        expected = []
        for kind, spelling in token_spellings:
            expected.append((kind, spelling, 1, column))
            column += len(spelling) + 1
        source = " ".join(spelling for kind, spelling in token_spellings) + " // @\n"
        expected.append(("EOF", "", 2, 1))
        assert list(tokenize(source)) == expected, source
    print(f"Python simulators: {checked} words match independent count and suffix predicates.")
    print("Lexer: 200 constructed statements and five boundary/diagnostic cases passed.")


def main():
    verify_automata()
    verify_implementations()


if __name__ == "__main__":
    main()
