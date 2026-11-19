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
        List<Student> students = new ArrayList<>(List.of(
                new Student(12, 80), new Student(7, 90), new Student(3, 80)));
        students.sort(Comparator.comparingInt(Student::mark).reversed()
                .thenComparingInt(Student::roll));
        System.out.println(students);
    }
}
