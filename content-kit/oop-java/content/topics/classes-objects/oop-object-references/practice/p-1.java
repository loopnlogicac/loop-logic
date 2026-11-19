import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Cell first = new Cell(input.nextInt());
            Cell alias = first;
            alias.value = input.nextInt();
            System.out.println(first.value);
        }
    }
}
class Cell {
    int value;
    Cell(int value) {
        this.value = value;
    }
}
