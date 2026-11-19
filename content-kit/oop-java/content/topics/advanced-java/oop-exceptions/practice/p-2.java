import java.util.Scanner;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int divisor = input.nextInt();
        try {
            System.out.println(120 / divisor);
        } catch (ArithmeticException problem) {
            System.out.println("ZERO");
        } finally {
            System.out.println("FINISHED");
        }
    }
}
