final class Calculator {
    int add(int left, int right) { return Math.addExact(left, right); }
    int divide(int left, int right) {
        if (right == 0) { throw new ArithmeticException("Zero divisor"); }
        if (left == Integer.MIN_VALUE && right == -1) {
            throw new ArithmeticException("Overflow");
        }
        return left / right;
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Calculator calculator = new Calculator();
        System.out.println(calculator.add(7, 2));
        System.out.println(calculator.divide(7, 2));
    }
}
