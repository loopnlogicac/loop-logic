import java.util.List;
import java.util.ArrayList;

record Student(int roll) implements Comparable<Student> {
    @Override
    public int compareTo(Student other) { return Integer.compare(roll, other.roll); }
}

class Main {
    public static void main(String[] args) throws Exception {
        List<Student> students = new ArrayList<>(List.of(new Student(7), new Student(2)));
        students.sort(null);
        for (Student student : students) { System.out.println(student.roll()); }
    }
}
