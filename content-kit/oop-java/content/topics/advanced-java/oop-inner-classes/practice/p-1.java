import java.util.Scanner;



class Main {
    static class Range {
        private final int low;
        private final int high;
        Range(int low, int high) { this.low = low; this.high = high; }
        boolean contains(int value) { return low <= value && value <= high; }
    }
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            Range range = new Range(input.nextInt(), input.nextInt());
            System.out.println(range.contains(input.nextInt()) ? "IN" : "OUT");
        }
    }
}
