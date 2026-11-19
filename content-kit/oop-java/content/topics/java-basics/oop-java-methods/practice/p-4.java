import java.util.Scanner;
class Main {
    static int digitSum(int n) {
        if (n < 10) {
            return n;
        }
        return n % 10 + digitSum(n / 10);
    }
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            System.out.println(digitSum(n));
        }
    }
}
