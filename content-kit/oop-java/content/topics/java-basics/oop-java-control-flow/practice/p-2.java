import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            int count = 0;
            for (int roll = 1; roll <= n; roll++) {
                if (roll % 2 == 0) {
                    count++;
                }
            }
            System.out.println(count);
        }
    }
}
