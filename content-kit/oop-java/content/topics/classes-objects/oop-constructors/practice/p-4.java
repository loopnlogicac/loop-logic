import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Result result = new Result(input.nextInt());
            System.out.println(result.mark);
        }
    }
}
class Result {
    int mark;
    Result(int mark) {
        this.mark = Math.max(0, Math.min(100, mark));
    }
}
