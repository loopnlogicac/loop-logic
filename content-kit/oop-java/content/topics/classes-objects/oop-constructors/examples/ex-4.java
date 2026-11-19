class Main {
    public static void main(String[] args) {
        Counter counter = new Counter();
        System.out.println(counter.value);
    }
}
class Counter {
    int value;
    Counter() {
        value = 10;
    }
}
