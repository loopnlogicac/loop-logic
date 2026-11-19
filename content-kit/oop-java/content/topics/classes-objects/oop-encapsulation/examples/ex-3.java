class Main {
    public static void main(String[] args) {
        SeatPool pool = new SeatPool(2);
        System.out.println(pool.reserve());
        System.out.println(pool.remaining());
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
