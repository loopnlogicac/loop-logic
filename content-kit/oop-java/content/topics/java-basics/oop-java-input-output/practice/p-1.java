import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            String title = input.nextLine();
            System.out.println("Course: " + title);
        }
    }
}
