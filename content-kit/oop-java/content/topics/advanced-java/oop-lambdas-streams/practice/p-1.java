import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        List<Integer> marks = new ArrayList<>();
        for (int i = 0; i < n; i++) { marks.add(input.nextInt()); }
        System.out.println(marks.stream().filter(mark -> mark >= 40)
                .mapToInt(Integer::intValue).sum());
    }
}
