import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            Integer[] counts = new Integer[n];
            for (int i = 0; i < n; i++) {
                counts[i] = input.nextInt();
            }
            int total = 0;
            for (Integer count : counts) {
                total += count;
            }
            System.out.println(total);
        }
    }
}
