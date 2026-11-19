import java.util.Locale;
class Main {
    public static void main(String[] args) {
        double average = 155 / 2.0;
        System.out.printf(Locale.ROOT, "Average: %.2f%n", average);
        String label = String.format(Locale.ROOT, "BDT %.2f", 125.5);
        System.out.println(label);
    }
}
