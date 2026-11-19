import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;

class Main {
    static <T> void transfer(List<? extends T> source, List<? super T> target) {
        for (T item : source) { target.add(item); }
    }
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        List<Integer> source = new ArrayList<>();
        for (int i = 0; i < n; i++) { source.add(input.nextInt()); }
        List<Number> target = new ArrayList<>();
        transfer(source, target);
        System.out.println(target);
    }
}
