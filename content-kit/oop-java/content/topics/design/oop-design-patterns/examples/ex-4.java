interface Listener { void changed(int seats); }
class Display implements Listener {
    private final String name;
    Display(String name) { this.name = name; }
    @Override
    public void changed(int seats) { System.out.println(name + " " + seats); }
}
class SeatBoard {
    private final Listener[] listeners = new Listener[2];
    private int size;
    boolean subscribe(Listener listener) {
        if (listener == null || size == listeners.length) { return false; }
        listeners[size++] = listener;
        return true;
    }
    void publish(int seats) {
        for (int i = 0; i < size; i++) { listeners[i].changed(seats); }
    }
}

class Main {
    public static void main(String[] args) {
        SeatBoard board = new SeatBoard();
        board.subscribe(new Display("Gate"));
        board.subscribe(new Display("Desk"));
        board.publish(12);
        board.publish(0);
    }
}
