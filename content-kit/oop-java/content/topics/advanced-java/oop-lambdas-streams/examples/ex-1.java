import java.util.function.IntUnaryOperator;

class Main {
    public static void main(String[] args) throws Exception {
        IntUnaryOperator bonus = mark -> Math.min(100, mark + 5);
        System.out.println(bonus.applyAsInt(98));
    }
}
