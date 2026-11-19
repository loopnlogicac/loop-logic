import java.util.Scanner;

class Pair<T> {
    private final T left;
    private final T right;
    Pair(T left, T right) { this.left = left; this.right = right; }
    String swapped() { return right + " " + left; }
}

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        Pair<Integer> pair = new Pair<>(input.nextInt(), input.nextInt());
        System.out.println(pair.swapped());
    }
}
