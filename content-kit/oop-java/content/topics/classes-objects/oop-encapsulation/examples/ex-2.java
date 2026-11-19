class Main {
    public static void main(String[] args) {
        Point point = new Point(3, 4);
        System.out.println(point.x() + " " + point.y());
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
