class Main {
    static int doubleOf(int value) {
        return value * 2;
    }
    static double doubleOf(double value) {
        return value * 2;
    }
    public static void main(String[] args) {
        System.out.println(doubleOf(3));
        System.out.println(doubleOf(3.5));
    }
}
