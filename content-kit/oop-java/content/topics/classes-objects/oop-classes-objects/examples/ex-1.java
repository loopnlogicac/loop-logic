class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.roll = 17;
        student.mark = 75;
        System.out.println(student.roll + " " + student.passed());
    }
}
class Student {
    int roll;
    int mark;
    boolean passed() {
        return mark >= 40;
    }
}
