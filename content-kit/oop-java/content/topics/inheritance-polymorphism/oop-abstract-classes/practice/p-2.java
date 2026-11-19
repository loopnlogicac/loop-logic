import java.util.Scanner;
abstract class Area { abstract int value(); }
class SquareArea extends Area {
    private final int side;
    SquareArea(int side) { this.side = side; }
    @Override
    int value() { return side * side; }
}
class RectangleArea extends Area {
    private final int width;
    private final int height;
    RectangleArea(int width, int height) {
        this.width = width;
        this.height = height;
    }
    @Override
    int value() { return width * height; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int kind = input.nextInt();
            int width = input.nextInt();
            int height = input.nextInt();
            Area area = kind == 0 ? new SquareArea(width) : new RectangleArea(width, height);
            System.out.println(area.value());
        }
    }
}
