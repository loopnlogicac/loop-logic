class Printer {
    void print(Object value) { System.out.println("Object"); }
    void print(String value) { System.out.println("String"); }
}
class DetailedPrinter extends Printer {
    @Override
    void print(Object value) { System.out.println("Detailed Object"); }
}

class Main {
    public static void main(String[] args) {
        Printer printer = new DetailedPrinter();
        Object value = "CSE";
        printer.print(value);
        printer.print("CSE");
    }
}
