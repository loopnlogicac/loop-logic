import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Student student = new Student();
            student.roll = input.nextInt();
            student.mark = input.nextInt();
            System.out.println(student.roll + " " + student.passed());
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
