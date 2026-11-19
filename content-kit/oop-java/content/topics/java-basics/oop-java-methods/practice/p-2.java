import java.util.Scanner;
class Main {
    static int maximum(int a, int b) {
        return a >= b ? a : b;
    }
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int a = input.nextInt();
            int b = input.nextInt();
            System.out.println(maximum(a, b));
        }
    }
}
