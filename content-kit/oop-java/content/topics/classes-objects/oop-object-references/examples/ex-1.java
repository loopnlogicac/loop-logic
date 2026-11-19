class Main {
    public static void main(String[] args) {
        Cell a = new Cell(5);
        Cell b = a;
        b.value = 8;
        System.out.println(a.value);
        System.out.println(a == b);
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
