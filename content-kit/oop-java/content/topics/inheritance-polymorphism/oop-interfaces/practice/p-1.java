import java.util.Scanner;
interface Counter {
    void accept(int value);
    int value();
}
class EvenCounter implements Counter {
    private int count;
    @Override
    public void accept(int value) { if (value % 2 == 0) { count++; } }
    @Override
    public int value() { return count; }
}
class PositiveCounter implements Counter {
    private int count;
    @Override
    public void accept(int value) { if (value > 0) { count++; } }
    @Override
    public int value() { return count; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int count = input.nextInt();
            Counter even = new EvenCounter();
            Counter positive = new PositiveCounter();
            for (int i = 0; i < count; i++) {
                int value = input.nextInt();
                even.accept(value);
                positive.accept(value);
            }
            System.out.println(even.value());
            System.out.println(positive.value());
        }
    }
}
