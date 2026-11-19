import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            System.out.println(MarkMath.clamp(input.nextInt()));
        }
    }
}
final class MarkMath {
    private MarkMath() {
    }
    static int clamp(int mark) {
        return Math.max(0, Math.min(100, mark));
    }
}
