import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            StringBuilder result = new StringBuilder();
            for (int roll = 1; roll <= n; roll++) {
                if (roll > 1) {
                    result.append(", ");
                }
                result.append(roll);
            }
            System.out.println(n == 0 ? "Empty" : result.toString());
        }
    }
}
