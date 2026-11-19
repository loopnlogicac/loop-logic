import java.util.Scanner;
import java.util.List;
import java.util.ArrayList;
import java.util.Locale;
import java.util.stream.Collectors;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        List<String> words = new ArrayList<>();
        for (int i = 0; i < n; i++) { words.add(input.next()); }
        List<String> result = words.stream().filter(word -> word.length() >= 3)
                .map(word -> word.toUpperCase(Locale.ROOT))
                .collect(Collectors.toCollection(ArrayList::new));
        System.out.println(result);
    }
}
