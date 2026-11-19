import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int rows = input.nextInt();
            int columns = input.nextInt();
            int[][] seats = new int[rows][columns];
            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < columns; c++) {
                    seats[r][c] = input.nextInt();
                }
            }
            int foundRow = -1;
            int foundColumn = -1;
            search:
            for (int r = 0; r < rows; r++) {
                for (int c = 0; c < columns; c++) {
                    if (seats[r][c] == 1) {
                        foundRow = r;
                        foundColumn = c;
                        break search;
                    }
                }
            }
            System.out.println(foundRow + " " + foundColumn);
        }
    }
}
