import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Integer first = Integer.valueOf(input.next());
            Integer second = Integer.valueOf(input.next());
            System.out.println(first.equals(second) ? "Same" : "Different");
        }
    }
}
