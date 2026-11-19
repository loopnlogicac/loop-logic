import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            long square = (long) n * n;
            System.out.println(square);
        }
    }
}
