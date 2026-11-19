class Parent { int value = 2; int read() { return value; } }
class Child extends Parent {
    int value = 9;
    @Override int read() { return value; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Parent item = new Child();
        System.out.println(item.value + " " + item.read());
    }
}
