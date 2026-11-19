class Counter {
    private int count;
    synchronized void increment() { count++; }
    synchronized int value() { return count; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Counter counter = new Counter();
        Runnable task = () -> {
            for (int i = 0; i < 1000; i++) { counter.increment(); }
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
