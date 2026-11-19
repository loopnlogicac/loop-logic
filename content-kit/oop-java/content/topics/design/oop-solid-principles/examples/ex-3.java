class Box {
    boolean writable() { return true; }
    void write(String text) { System.out.println(text); }
}
class FixedBox extends Box {
    @Override
    boolean writable() { return false; }
    @Override
    void write(String text) { throw new UnsupportedOperationException("read only"); }
}
interface Reader { String read(); }
class Archive implements Reader {
    @Override
    public String read() { return "saved"; }
}

class Main {
    public static void main(String[] args) {
        FixedBox box = new FixedBox();
        System.out.println(box.writable());
        Reader reader = new Archive();
        System.out.println(reader.read());
    }
}
