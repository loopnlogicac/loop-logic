import java.util.Locale;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            input.useLocale(Locale.ROOT);
            double amount = input.nextDouble();
            System.out.printf(Locale.ROOT, "BDT %.2f%n", amount);
        }
    }
}
