class Parent { String name() { return "parent"; } }
class Child extends Parent { @Override String name() { return "child"; } }

class Main {
    public static void main(String[] args) throws Exception {
        Parent item = new Child();
        System.out.println(item.name());
    }
}
