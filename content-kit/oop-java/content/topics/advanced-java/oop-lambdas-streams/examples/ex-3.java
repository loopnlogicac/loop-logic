import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

class Main {
    public static void main(String[] args) throws Exception {
        List<String> words = List.of("pen", "book");
        List<Integer> lengths = words.stream().map(String::length)
                .collect(Collectors.toCollection(ArrayList::new));
        lengths.add(1);
        System.out.println(lengths);
    }
}
