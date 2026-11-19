import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int total = 0;
            while (input.hasNextInt()) {
                total += input.nextInt();
            }
            System.out.println(total);
        }
    }
}
