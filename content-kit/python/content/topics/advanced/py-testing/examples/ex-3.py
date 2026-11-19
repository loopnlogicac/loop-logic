import io
import unittest

def mark(value):
    if not 0 <= value <= 100:
        raise ValueError("outside range")
    return value

class MarkTests(unittest.TestCase):
    def test_too_large(self):
        with self.assertRaises(ValueError):
            mark(101)
    def test_zero(self):
        self.assertEqual(mark(0), 0)


def main():
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(MarkTests)
    result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
    print(result.testsRun, result.wasSuccessful())
    if not result.wasSuccessful():
        raise SystemExit(1)


if __name__ == "__main__":
    main()
