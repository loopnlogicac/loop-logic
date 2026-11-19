import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            int[] marks = new int[n];
            for (int i = 0; i < n; i++) {
                marks[i] = input.nextInt();
            }
            int sum = 0;
            for (int mark : marks) {
                sum += mark;
            }
            System.out.println(sum);
        }
    }
}
