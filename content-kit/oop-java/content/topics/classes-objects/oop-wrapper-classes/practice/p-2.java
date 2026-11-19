import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            String text = input.next();
            int roll = Integer.parseInt(text);
            System.out.println(roll + 1);
        }
    }
}
