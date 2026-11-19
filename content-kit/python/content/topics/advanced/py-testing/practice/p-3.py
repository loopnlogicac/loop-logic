import io
import unittest


def main():
    a, b, expected = map(int, input().split())
    class AdditionTest(unittest.TestCase):
        def test_sum(self):
            self.assertEqual(a + b, expected)
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(AdditionTest)
    result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
    print("PASS" if result.wasSuccessful() else "FAIL")


if __name__ == "__main__":
    main()
