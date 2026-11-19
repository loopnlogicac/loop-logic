import java.util.Scanner;
final class Result {
    private final int roll;
    private final int mark;
    Result(int roll, int mark) { this.roll = roll; this.mark = mark; }
    String label() { return roll + ":" + mark; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Result result = new Result(input.nextInt(), input.nextInt());
            System.out.println(result.label());
        }
    }
}
