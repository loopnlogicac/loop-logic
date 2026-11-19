import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            Cell previous = null;
            int identical = 0;
            for (int i = 0; i < n; i++) {
                int value = input.nextInt();
                Cell current;
                if (previous != null && previous.value == value) {
                    current = previous;
                } else {
                    current = new Cell(value);
                }
                if (previous != null && previous == current) {
                    identical++;
                }
                previous = current;
            }
            System.out.println(identical);
        }
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
