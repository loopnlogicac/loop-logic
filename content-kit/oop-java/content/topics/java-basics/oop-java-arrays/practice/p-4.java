import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int rows = input.nextInt();
            int[][] values = new int[rows][];
            for (int r = 0; r < rows; r++) {
                int length = input.nextInt();
                values[r] = new int[length];
                for (int c = 0; c < length; c++) {
                    values[r][c] = input.nextInt();
                }
            }
            if (rows == 0) {
                System.out.println("Empty");
            }
            for (int[] row : values) {
                int sum = 0;
                for (int value : row) {
                    sum += value;
                }
                System.out.println(sum);
            }
        }
    }
}
