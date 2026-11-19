import java.util.Scanner;
interface Sink { void record(int mark); }
class SumSink implements Sink {
    private int total;
    @Override
    public void record(int mark) { total += mark; }
    int value() { return total; }
}
class CountSink implements Sink {
    private int count;
    @Override
    public void record(int mark) { count++; }
    int value() { return count; }
}
class MarkService {
    private final Sink sink;
    MarkService(Sink sink) { this.sink = sink; }
    void save(int mark) { sink.record(mark); }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int count = input.nextInt();
            SumSink sum = new SumSink();
            CountSink counter = new CountSink();
            MarkService first = new MarkService(sum);
            MarkService second = new MarkService(counter);
            for (int i = 0; i < count; i++) {
                int mark = input.nextInt();
                first.save(mark);
                second.save(mark);
            }
            System.out.println(sum.value() + " " + counter.value());
        }
    }
}
