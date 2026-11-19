class Cell { int value; Cell(int value) { this.value = value; } }

class Main {
    static void change(Cell cell) { cell = new Cell(9); }
    public static void main(String[] args) throws Exception {
        Cell cell = new Cell(4);
        change(cell);
        System.out.println(cell.value);
    }
}
