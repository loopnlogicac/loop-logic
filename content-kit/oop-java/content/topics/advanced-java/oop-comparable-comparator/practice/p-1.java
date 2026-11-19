import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

class Student implements Comparable<Student> {
    private final int roll;
    private final int mark;
    Student(int roll, int mark) { this.roll = roll; this.mark = mark; }
    int roll() { return roll; }
    int mark() { return mark; }
    @Override
    public int compareTo(Student other) { return Integer.compare(roll, other.roll); }
    @Override
    public String toString() { return roll + ":" + mark; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        List<Student> students = new ArrayList<>();
        for (int i = 0; i < n; i++) { students.add(new Student(input.nextInt(), input.nextInt())); }
        students.sort(Comparator.comparingInt(Student::mark).reversed()
                .thenComparingInt(Student::roll));
        System.out.println(students);
    }
}
