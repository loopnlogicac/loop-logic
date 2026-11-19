import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Room room = new Room(input.nextInt(), input.nextInt());
            System.out.println(room.area());
        }
    }
}
class Room {
    int width;
    int height;
    Room(int width, int height) {
        this.width = width;
        this.height = height;
    }
    int area() {
        return width * height;
    }
}
