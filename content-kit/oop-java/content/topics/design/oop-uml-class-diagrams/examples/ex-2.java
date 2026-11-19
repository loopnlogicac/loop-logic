class Student {
    private final int roll;
    Student(int roll) { this.roll = roll; }
    int roll() { return roll; }
}
class Lab {
    private final Student[] students = new Student[2];
    private int size;
    boolean add(Student student) {
        if (student == null || size == students.length) { return false; }
        students[size++] = student;
        return true;
    }
    int size() { return size; }
}

class Main {
    public static void main(String[] args) {
        Lab lab = new Lab();
        System.out.println(lab.add(new Student(1)));
        System.out.println(lab.add(new Student(2)));
        System.out.println(lab.add(new Student(3)));
        System.out.println(lab.size());
    }
}
