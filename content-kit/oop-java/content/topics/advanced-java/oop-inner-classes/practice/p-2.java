import java.util.Scanner;
import java.util.function.IntUnaryOperator;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int base = input.nextInt();
            int bonus = input.nextInt();
            class BonusRule implements IntUnaryOperator {
                @Override
                public int applyAsInt(int value) { return Math.min(100, value + bonus); }
            }
            System.out.println(new BonusRule().applyAsInt(base));
        }
    }
}
