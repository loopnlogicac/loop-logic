import java.util.Scanner;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            String left = input.nextLine().trim();
            String right = input.nextLine().trim();
            try {
                System.out.println(Math.addExact(Integer.parseInt(left), Integer.parseInt(right)));
            } catch (NumberFormatException failure) {
                System.out.println("FORMAT");
            } catch (ArithmeticException failure) {
                System.out.println("OVERFLOW");
            }
        }
    }
}
