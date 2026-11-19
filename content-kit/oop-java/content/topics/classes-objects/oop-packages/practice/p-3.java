import java.util.Scanner;
import static java.lang.Math.max;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int a = input.nextInt();
            int b = input.nextInt();
            System.out.println(max(a, b));
        }
    }
}
