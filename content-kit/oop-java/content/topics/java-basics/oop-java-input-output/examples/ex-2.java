import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            System.out.println("Enter roll then name on the next line:");
            int roll = input.nextInt();
            input.nextLine();
            String name = input.nextLine();
            System.out.println(roll + ": " + name);
        }
    }
}
