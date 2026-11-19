import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            int[] source = new int[n];
            for (int i = 0; i < n; i++) {
                source[i] = input.nextInt();
            }
            Marks marks = new Marks(source);
            source[0] = -1;
            System.out.println(marks.first());
        }
    }
}
final class Marks {
    private final int[] values;
    Marks(int[] values) {
        this.values = values.clone();
    }
    public int first() {
        return values[0];
    }
}
