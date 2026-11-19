import java.util.Scanner;
class Result {
    String label(int mark) { return "Mark " + mark; }
}
class HonoursResult extends Result {
    @Override
    String label(int mark) {
        return super.label(mark) + (mark >= 80 ? "!" : "");
    }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int mark = input.nextInt();
            Result[] results = {new Result(), new HonoursResult()};
            for (Result result : results) {
                System.out.println(result.label(mark));
            }
        }
    }
}
