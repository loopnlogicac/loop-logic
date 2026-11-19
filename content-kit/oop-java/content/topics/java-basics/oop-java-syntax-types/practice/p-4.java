import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int credits = input.nextInt();
            int rate = input.nextInt();
            final int FIXED_FEE = 500;
            System.out.println(credits * rate + FIXED_FEE);
        }
    }
}
