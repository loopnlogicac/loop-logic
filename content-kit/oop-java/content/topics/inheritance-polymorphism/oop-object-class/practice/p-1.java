import java.util.Scanner;
final class Course {
    private final String code;
    Course(String code) { this.code = code; }
    @Override
    public boolean equals(Object other) {
        if (this == other) { return true; }
        if (!(other instanceof Course course)) { return false; }
        return code.equals(course.code);
    }
    @Override
    public int hashCode() { return code.hashCode(); }
    @Override
    public String toString() { return "Course[" + code + "]"; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Course first = new Course(input.next());
            Course second = new Course(input.next());
            System.out.println(first.equals(second));
            System.out.println(first.hashCode() == second.hashCode());
        }
    }
}
