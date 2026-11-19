import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            String first = input.next();
            String second = input.next();
            System.out.println(first.equals(second) ? "Same" : "Different");
        }
    }
}
