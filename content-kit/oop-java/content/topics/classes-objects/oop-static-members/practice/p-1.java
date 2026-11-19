import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            for (int i = 0; i < n; i++) {
                new Student();
            }
            System.out.println(Student.count());
        }
    }
}
class Student {
    private static int created;
    private final int id;
    Student() {
        created++;
        id = created;
    }
    public int id() {
        return id;
    }
    public static int count() {
        return created;
    }
}
