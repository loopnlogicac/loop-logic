import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int flag = input.nextInt();
            int value = input.nextInt();
            Cell cell = flag == 1 ? new Cell(value) : null;
            if (cell == null) {
                System.out.println("Missing");
            } else {
                System.out.println(cell.value);
            }
        }
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
