import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int total = input.nextInt();
            System.out.println(total / 2.0);
        }
    }
}
