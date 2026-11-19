import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Integer mark = input.nextInt();
            int adjusted = mark + 5;
            System.out.println(adjusted);
        }
    }
}
