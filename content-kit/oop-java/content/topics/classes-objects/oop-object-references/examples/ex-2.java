class Main {
    public static void main(String[] args) {
        Cell a = new Cell(5);
        Cell b = new Cell(5);
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
