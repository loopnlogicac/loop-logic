class Main {
    public static void main(String[] args) {
        Student first = new Student();
        Student second = new Student();
        first.mark = 70;
        second.mark = 35;
        System.out.println(first.passed());
        System.out.println(second.passed());
    }
}
class Student {
    int roll;
    int mark;
    boolean passed() {
        return mark >= 40;
    }
}
