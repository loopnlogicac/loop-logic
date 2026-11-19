import java.util.Scanner;
class Counter {
    private int count;
    void increment() { count++; }
    int value() { return count; }
}
class Desk {
    private final Counter counter = new Counter();
    void visit() { counter.increment(); }
    int count() { return counter.value(); }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int a = input.nextInt();
            int b = input.nextInt();
            Desk first = new Desk();
            Desk second = new Desk();
            for (int i = 0; i < a; i++) { first.visit(); }
            for (int i = 0; i < b; i++) { second.visit(); }
            System.out.println(first.count() + " " + second.count());
        }
    }
}
