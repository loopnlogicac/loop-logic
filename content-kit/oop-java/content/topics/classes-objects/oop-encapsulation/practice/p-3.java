import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            SeatPool pool = new SeatPool(input.nextInt());
            int requests = input.nextInt();
            int success = 0;
            for (int i = 0; i < requests; i++) {
                if (pool.reserve()) {
                    success++;
                }
            }
            System.out.println(success + " " + pool.remaining());
        }
    }
}
class SeatPool {
    private int remaining;
    SeatPool(int capacity) {
        remaining = capacity;
    }
    public boolean reserve() {
        if (remaining == 0) {
            return false;
        }
        remaining--;
        return true;
    }
    public int remaining() {
        return remaining;
    }
}
