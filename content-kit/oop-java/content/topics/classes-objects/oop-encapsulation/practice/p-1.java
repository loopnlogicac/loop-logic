import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Result result = new Result();
            result.setMark(input.nextInt());
            result.setMark(input.nextInt());
            System.out.println(result.getMark());
        }
    }
}
class Result {
    private int mark;
    public boolean setMark(int mark) {
        if (mark < 0 || mark > 100) {
            return false;
        }
        this.mark = mark;
        return true;
    }
    public int getMark() {
        return mark;
    }
}
