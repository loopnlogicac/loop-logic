import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Student student = new Student(input.nextInt());
            System.out.println(student.getRoll());
        }
    }
}
class Student {
    private int roll;
    Student(int roll) {
        this.roll = roll;
    }
    public int getRoll() {
        return roll;
    }
}
