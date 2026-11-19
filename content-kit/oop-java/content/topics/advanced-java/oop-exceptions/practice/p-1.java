import java.util.Scanner;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        String text = input.next();
        try {
            int mark = Integer.parseInt(text);
            if (mark < 0 || mark > 100) { throw new IllegalArgumentException("RANGE"); }
            System.out.println(mark);
        } catch (NumberFormatException problem) {
            System.out.println("FORMAT");
        } catch (IllegalArgumentException problem) {
            System.out.println(problem.getMessage());
        }
    }
}
