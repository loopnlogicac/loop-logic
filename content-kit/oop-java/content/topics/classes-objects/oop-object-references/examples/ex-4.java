class Main {
    static void change(Cell cell) {
        cell.value = 7;
        cell = new Cell(9);
    }
    public static void main(String[] args) {
        Cell cell = new Cell(5);
        change(cell);
        System.out.println(cell.value);
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
