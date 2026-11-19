import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Student first = new Student();
            Student second = new Student();
            first.mark = input.nextInt();
            second.mark = input.nextInt();
            first.mark = Math.min(100, first.mark + 5);
            System.out.println(first.mark + " " + second.mark);
        }
    }
}
class Student {
    int roll;
    int mark;
    boolean passed() {
        return mark >= 40;
    }
}
