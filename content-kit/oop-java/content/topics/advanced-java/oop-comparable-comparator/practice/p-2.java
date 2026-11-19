import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) { words.add(input.next()); }
        words.sort(Comparator.comparingInt(String::length)
                .thenComparing(Comparator.naturalOrder()));
        System.out.println(words);
    }
}
