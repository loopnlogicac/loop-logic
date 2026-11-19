import java.util.Scanner;
class Main {
    static void revise(int[] values) {
        values[0] = 100;
    }
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            int[] marks = new int[n];
            for (int i = 0; i < n; i++) {
                marks[i] = input.nextInt();
            }
            revise(marks);
            System.out.println(marks[0]);
        }
    }
}
