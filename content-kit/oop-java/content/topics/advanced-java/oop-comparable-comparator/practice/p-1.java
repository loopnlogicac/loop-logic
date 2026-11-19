import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

record Result(int roll, int mark) { }

class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            List<Result> results = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                results.add(new Result(input.nextInt(), input.nextInt()));
            }
            results.sort(Comparator.comparingInt(Result::mark).reversed()
                .thenComparingInt(Result::roll));
            for (Result result : results) {
                System.out.println(result.roll() + " " + result.mark());
            }
        }
    }
}
