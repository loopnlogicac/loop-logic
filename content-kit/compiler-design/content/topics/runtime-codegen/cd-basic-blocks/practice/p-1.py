from dataclasses import dataclass


@dataclass(frozen=True)
class Instruction:
    op: str
    text: str
    target: int | None = None


def basic_blocks(instructions):
    count = len(instructions)
    if not count:
        return [], []
    leaders = {0}
    for index, instruction in enumerate(instructions):
        if instruction.op not in {"assign", "if", "goto", "return"}:
            raise ValueError(f"unknown operation at {index}")
        if instruction.op in {"if", "goto"}:
            target = instruction.target
            if type(target) is not int or not 0 <= target < count:
                raise ValueError(f"bad target at {index}")
            leaders.add(target)
        elif instruction.target is not None:
            raise ValueError(f"unexpected target at {index}")
        if instruction.op in {"if", "goto", "return"} and index + 1 < count:
            leaders.add(index + 1)
    starts = sorted(leaders)
    blocks = [list(range(start, starts[i + 1] if i + 1 < len(starts) else count))
              for i, start in enumerate(starts)]
    owner = {index: block for block, indexes in enumerate(blocks) for index in indexes}
    edges = []
    for block, indexes in enumerate(blocks):
        last = instructions[indexes[-1]]
        successors = set()
        if last.op in {"if", "goto"}:
            successors.add(owner[last.target])
        if last.op not in {"goto", "return"} and block + 1 < len(blocks):
            successors.add(block + 1)
        edges.append(sorted(successors))
    return blocks, edges


def show_blocks(instructions):
    blocks, edges = basic_blocks(instructions)
    if not blocks:
        print("empty")
    for number, indexes in enumerate(blocks):
        members = " ".join(str(index) for index in indexes)
        targets = " ".join(f"B{target}" for target in edges[number]) or "exit"
        print(f"B{number}: {members} -> {targets}")


import json
import sys


def read_instructions():
    records = json.load(sys.stdin)
    return [Instruction(record[0], "", record[1] if len(record) == 2 else None)
            for record in records]


if __name__ == "__main__":
    print("Instructions:")
    try:
        show_blocks(read_instructions())
    except (ValueError, TypeError, IndexError):
        print("invalid")
