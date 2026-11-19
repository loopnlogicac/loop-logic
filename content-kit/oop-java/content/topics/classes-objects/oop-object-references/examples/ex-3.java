class Main {
    public static void main(String[] args) {
        Cell cell = null;
        if (cell != null) {
            System.out.println(cell.value);
        } else {
            System.out.println("No cell");
        }
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
