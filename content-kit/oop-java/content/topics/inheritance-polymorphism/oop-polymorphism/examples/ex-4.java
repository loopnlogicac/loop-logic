class Base {
    int number = 1;
    int read() { return number; }
}
class Child extends Base {
    int number = 2;
    @Override
    int read() { return number; }
}

class Main {
    public static void main(String[] args) {
        Base item = new Child();
        System.out.println(item.number);
        System.out.println(item.read());
    }
}
