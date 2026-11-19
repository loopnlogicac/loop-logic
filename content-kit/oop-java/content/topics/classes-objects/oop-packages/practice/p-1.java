import java.util.Arrays;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            int[] values = new int[n];
            for (int i = 0; i < n; i++) {
                values[i] = input.nextInt();
            }
            System.out.println(Arrays.toString(values));
        }
    }
}
