import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            String course = input.next();
            System.out.println(course.length());
        }
    }
}
