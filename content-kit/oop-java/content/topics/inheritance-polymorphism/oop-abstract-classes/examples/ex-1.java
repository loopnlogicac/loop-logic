abstract class Plot {
    abstract int area();
}
class Rectangle extends Plot {
    private final int width;
    private final int height;
    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }
    @Override
    int area() { return width * height; }
}

class Main {
    public static void main(String[] args) {
        Plot plot = new Rectangle(4, 6);
        System.out.println(plot.area());
    }
}
