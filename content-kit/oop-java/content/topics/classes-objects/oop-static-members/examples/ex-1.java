class Main {
    public static void main(String[] args) {
        Student first = new Student();
        Student second = new Student();
        System.out.println(first.id() + " " + second.id());
        System.out.println(Student.count());
    }
}
class Student {
    private static int created;
    private final int id;
    Student() {
        created++;
        id = created;
    }
    public int id() {
        return id;
    }
    public static int count() {
        return created;
    }
}
