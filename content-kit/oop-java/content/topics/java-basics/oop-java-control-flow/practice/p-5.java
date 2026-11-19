import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int day = input.nextInt();
            String label = switch (day) {
                case 5, 6 -> "Weekend";
                default -> "Class day";
            };
            System.out.println(label);
        }
    }
}
