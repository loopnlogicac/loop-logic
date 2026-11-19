class Counter {
    private final int count;
    Counter(int count) { this.count = count; }
    class View {
        int read() { return count; }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Counter first = new Counter(3);
        Counter second = new Counter(8);
        Counter.View view = first.new View();
        System.out.println(view.read());
        System.out.println(second.new View().read());
    }
}
