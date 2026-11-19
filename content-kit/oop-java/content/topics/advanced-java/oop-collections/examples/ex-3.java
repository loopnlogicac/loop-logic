import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.List;

class Main {
    public static void main(String[] args) throws Exception {
        Map<String, Integer> counts = new HashMap<>();
        for (String word : List.of("book", "pen", "book")) {
            counts.put(word, counts.getOrDefault(word, 0) + 1);
        }
        for (Map.Entry<String, Integer> entry : new TreeMap<>(counts).entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
    }
}
