import java.util.Scanner;



class Main {
    static int capacity(int rows, int columns) { return rows * columns; }
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            System.out.println(capacity(input.nextInt(), input.nextInt()));
        }
    }
}
