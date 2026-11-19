import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            Counter counter = new Counter();
            for (int i = 0; i < n; i++) {
                counter.increment();
            }
            System.out.println(counter.value());
        }
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
