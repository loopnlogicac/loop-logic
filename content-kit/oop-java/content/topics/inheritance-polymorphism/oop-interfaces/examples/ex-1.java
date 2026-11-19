interface Readable { String read(); }
interface Printable { void print(); }
class Terminal implements Readable, Printable {
    @Override
    public String read() { return "CSE 212"; }
    @Override
    public void print() { System.out.println("Receipt ready"); }
}

class Main {
    public static void main(String[] args) {
        Terminal terminal = new Terminal();
        Readable reader = terminal;
        Printable printer = terminal;
        System.out.println(reader.read());
        printer.print();
    }
}
