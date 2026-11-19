import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Point point = new Point(input.nextInt(), input.nextInt());
            System.out.println(point.x() * point.x() + point.y() * point.y());
        }
    }
}
final class Point {
    private final int x;
    private final int y;
    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    public int x() {
        return x;
    }
    public int y() {
        return y;
    }
}
