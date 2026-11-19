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
        Course first = new Course("Aa");
        Course second = new Course("BB");
        System.out.println(first.hashCode() == second.hashCode());
        System.out.println(first.equals(second));
    }
}
