import io
import unittest

def total(values):
    return sum(values)

class TotalTests(unittest.TestCase):
    def test_empty(self):
        self.assertEqual(total([]), 0)
    def test_mixed(self):
        self.assertEqual(total([3, -1, 5]), 7)


def main():
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TotalTests)
    result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
    print(result.testsRun, len(result.failures), len(result.errors))
    if not result.wasSuccessful():
        raise SystemExit(1)


if __name__ == "__main__":
    main()
