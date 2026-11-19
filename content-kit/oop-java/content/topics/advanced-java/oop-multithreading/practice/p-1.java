import java.util.Scanner;

class Counter {
    private int value;
    synchronized void increment() { value++; }
    synchronized int value() { return value; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        Counter counter = new Counter();
        Runnable task = () -> {
            for (int i = 0; i < n; i++) { counter.increment(); }
        };
        Thread first = new Thread(task);
        Thread second = new Thread(task);
        first.start();
        second.start();
        first.join();
        second.join();
        System.out.println(counter.value());
    }
}
