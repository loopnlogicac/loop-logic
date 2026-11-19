class Parent {}
class Child extends Parent {}

class Main {
    static String pick(Parent item) { return "P"; }
    static String pick(Child item) { return "C"; }
    public static void main(String[] args) throws Exception {
        Parent item = new Child();
        System.out.println(pick(item));
    }
}
