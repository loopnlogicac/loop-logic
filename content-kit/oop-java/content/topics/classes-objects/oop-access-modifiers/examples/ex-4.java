class Main {
    public static void main(String[] args) {
        Counter counter = new Counter();
        counter.increment();
        System.out.println(counter.value());
    }
}
class Counter {
    private int count;
    public void increment() {
        count++;
    }
    public int value() {
        return count;
    }
}
