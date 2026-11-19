import java.util.Scanner;
class Main {
    static void increment(Cell cell) {
        cell.value++;
    }
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Cell cell = new Cell(input.nextInt());
            increment(cell);
            System.out.println(cell.value);
        }
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
