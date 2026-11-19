import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

record Result(int roll, int mark) { }

class Main {
    public static void main(String[] args) throws Exception {
        List<Result> results = new ArrayList<>(List.of(
            new Result(4, 80), new Result(2, 80), new Result(1, 90)));
        Comparator<Result> ranking = Comparator.comparingInt(Result::mark).reversed()
            .thenComparingInt(Result::roll);
        results.sort(ranking);
        for (Result result : results) { System.out.println(result.roll() + " " + result.mark()); }
    }
}
