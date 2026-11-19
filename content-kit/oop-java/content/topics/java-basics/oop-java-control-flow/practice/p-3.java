import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            int[] days = new int[n];
            for (int i = 0; i < n; i++) {
                days[i] = input.nextInt();
            }
            int total = 0;
            for (int day : days) {
                total += day;
            }
            System.out.println(total);
        }
    }
}
