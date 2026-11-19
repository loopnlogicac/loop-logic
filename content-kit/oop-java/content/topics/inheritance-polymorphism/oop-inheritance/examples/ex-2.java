class Person {
    Person() { System.out.println("Person"); }
}
class Student extends Person {
    Student() { System.out.println("Student"); }
}
class LabTutor extends Student {
    LabTutor() { System.out.println("LabTutor"); }
}

class Main {
    public static void main(String[] args) {
        new LabTutor();
    }
}
