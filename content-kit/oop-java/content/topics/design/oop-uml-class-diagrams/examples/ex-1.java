class Student {
    private final int roll;
    Student(int roll) { this.roll = roll; }
    public int roll() { return roll; }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student(42);
        System.out.println(student.roll());
    }
}
