import java.util.Scanner;

class Calculator {
    int add(int left, int right) {
        if (Math.abs((long) left) > 1000 || Math.abs((long) right) > 1000) {
            throw new IllegalArgumentException("Use -1000..1000");
        }
        return left + right;
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        try {
            int left = Integer.parseInt(input.next());
            int right = Integer.parseInt(input.next());
            System.out.println(new Calculator().add(left, right));
        } catch (NumberFormatException problem) {
            System.out.println("FORMAT");
        } catch (IllegalArgumentException problem) {
            System.out.println("RANGE");
        }
    }
}
