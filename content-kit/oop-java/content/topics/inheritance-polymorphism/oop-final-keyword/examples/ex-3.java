class Main {
    public static void main(String[] args) {
        int bonus = 5;
        java.util.function.IntUnaryOperator addBonus = mark -> mark + bonus;
        System.out.println(addBonus.applyAsInt(70));
    }
}
