import java.util.Scanner;

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
        try (Scanner input = new Scanner(System.in)) {
            String operation = input.next();
            int left = input.nextInt();
            int right = input.nextInt();
            Calculator model = new Calculator();
            try {
                System.out.println(operation.equals("ADD") ? model.add(left, right)
                    : model.divide(left, right));
            } catch (ArithmeticException failure) { System.out.println("ERROR"); }
        }
    }
}
