import java.util.function.IntUnaryOperator;



class Main {
    public static void main(String[] args) throws Exception {
        int bonus = 4;
        IntUnaryOperator adjust = mark -> Math.min(100, mark + bonus);
        System.out.println(adjust.applyAsInt(70));
        System.out.println(adjust.applyAsInt(99));
    }
}
