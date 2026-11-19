import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int mark = input.nextInt();
            if (mark >= 40) {
                System.out.println("Pass");
            } else {
                System.out.println("Retry");
            }
        }
    }
}
