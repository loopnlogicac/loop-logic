import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            Student[] students = new Student[n];
            for (int i = 0; i < n; i++) {
                students[i] = new Student();
                students[i].mark = input.nextInt();
            }
            int count = 0;
            for (Student student : students) {
                if (student.passed()) {
                    count++;
                }
            }
            System.out.println(count);
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
