class Main {
    public static void main(String[] args) {
        Student first = new Student();
        Student second = first;
        second.mark = 90;
        System.out.println(first.mark);
    }
}
class Student {
    int roll;
    int mark;
    boolean passed() {
        return mark >= 40;
    }
}
