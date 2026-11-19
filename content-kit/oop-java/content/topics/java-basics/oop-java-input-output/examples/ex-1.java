import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            System.out.print("Enter two marks: ");
            int first = input.nextInt();
            int second = input.nextInt();
            System.out.println(first + second);
        }
    }
}
