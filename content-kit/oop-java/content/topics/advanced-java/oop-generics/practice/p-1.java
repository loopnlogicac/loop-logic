import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;



class Main {
    static <T> T last(List<T> values) { return values.get(values.size() - 1); }
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            List<Integer> values = new ArrayList<>();
            for (int i = 0; i < n; i++) { values.add(input.nextInt()); }
            System.out.println(last(values));
        }
    }
}
