import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int course = input.nextInt();
            System.out.println("CSE " + course);
            System.out.println("Lab ready");
        }
    }
}
