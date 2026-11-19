class Main {
    public static void main(String[] args) {
        Student student = new Student();
        System.out.println(student.roll);
        System.out.println(student.passed());
    }
}
class Student {
    int roll;
    int mark;
    boolean passed() {
        return mark >= 40;
    }
}
