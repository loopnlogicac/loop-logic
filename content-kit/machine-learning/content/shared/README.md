# Shared content and reproducibility

- `datasets/`: all six offline course CSVs, a seeded rebuilding program and column documentation.
- `make_figures.py`: computes static quiz panel data from the fruit CSV, invented event lists and the real train/test reference model. It also produces the five worksheet SVGs. Uses the Python standard library only.
- `figures.json`: computed panel catalogue; quiz objects embed these same figures.
- `verify_labs.mjs`: additional semantic checks using the kit's real lab state reducer, independent predictions and actual Python runs. Run from the repository checkout; it imports `content-kit/tools/labs.mjs`.
- `verify_content.py`: checks package versions, CSV invariants and repeated rebuilds, generated panel data, worksheet equality, English/Bangla parity and recorded outputs. NumPy is needed by the dataset generator it executes; all four requested packages must be installed at the versions in the manifest.
- Adjacent `.out` files: console output captured from successful runs of the corresponding programs. The three teacher references have their `.out` files beside them in the lab directories.

Student pages do not include these supporting programs. Module 1 remains a sequence of paper activities and interactive pictures, with no programming prerequisite. See `../NOTES.md` for solver scope, tie conventions, verification commands and the master-brief no-code interpretation.
