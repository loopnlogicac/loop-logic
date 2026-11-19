import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int roll = input.nextInt();
            System.out.println("Roll: " + roll);
        }
    }
}
