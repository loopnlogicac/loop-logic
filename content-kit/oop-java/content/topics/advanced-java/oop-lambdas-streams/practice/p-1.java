import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            List<Integer> marks = new ArrayList<>();
            for (int i = 0; i < n; i++) { marks.add(input.nextInt()); }
            int total = marks.stream().filter(mark -> mark >= 40)
                .mapToInt(Integer::intValue).sum();
            System.out.println(total);
        }
    }
}
