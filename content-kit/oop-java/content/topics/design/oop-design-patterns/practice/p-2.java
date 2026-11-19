import java.util.Scanner;
interface Listener { void changed(int seats); }
class SumListener implements Listener {
    private int sum;
    @Override
    public void changed(int seats) { sum += seats; }
    int value() { return sum; }
}
class LatestListener implements Listener {
    private int latest;
    @Override
    public void changed(int seats) { latest = seats; }
    int value() { return latest; }
}
class Board {
    private final Listener[] listeners;
    Board(Listener first, Listener second) { listeners = new Listener[] {first, second}; }
    void publish(int seats) {
        for (Listener listener : listeners) { listener.changed(seats); }
    }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int count = input.nextInt();
            SumListener sum = new SumListener();
            LatestListener latest = new LatestListener();
            Board board = new Board(sum, latest);
            for (int i = 0; i < count; i++) { board.publish(input.nextInt()); }
            System.out.println(sum.value() + " " + latest.value());
        }
    }
}
