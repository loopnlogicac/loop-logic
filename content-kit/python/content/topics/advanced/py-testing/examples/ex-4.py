import io
import unittest

class WalletTests(unittest.TestCase):
    def setUp(self):
        self.wallet = {"balance": 100}
    def test_change(self):
        self.wallet["balance"] -= 20
        self.assertEqual(self.wallet["balance"], 80)
    def test_initial(self):
        self.assertEqual(self.wallet["balance"], 100)


def main():
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(WalletTests)
    result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
    print(result.testsRun, result.wasSuccessful())
    if not result.wasSuccessful():
        raise SystemExit(1)


if __name__ == "__main__":
    main()
