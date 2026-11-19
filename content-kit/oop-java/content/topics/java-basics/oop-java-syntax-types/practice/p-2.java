import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int poisha = input.nextInt();
            System.out.println(poisha / 100 + " " + poisha % 100);
        }
    }
}
