import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Rectangle room = new Rectangle();
            room.width = input.nextInt();
            room.height = input.nextInt();
            System.out.println(room.area());
        }
    }
}
class Rectangle {
    int width;
    int height;
    int area() {
        return width * height;
    }
}
