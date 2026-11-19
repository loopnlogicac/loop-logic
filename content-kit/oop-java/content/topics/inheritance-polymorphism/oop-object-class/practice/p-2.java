import java.util.Scanner;
final class Seat {
    private final int row;
    private final int column;
    Seat(int row, int column) { this.row = row; this.column = column; }
    @Override
    public boolean equals(Object other) {
        if (this == other) { return true; }
        if (!(other instanceof Seat seat)) { return false; }
        return row == seat.row && column == seat.column;
    }
    @Override
    public int hashCode() { return 31 * row + column; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int count = input.nextInt();
            Seat target = new Seat(input.nextInt(), input.nextInt());
            int matches = 0;
            for (int i = 0; i < count; i++) {
                Seat seat = new Seat(input.nextInt(), input.nextInt());
                if (target.equals(seat)) { matches++; }
            }
            System.out.println(matches);
        }
    }
}
