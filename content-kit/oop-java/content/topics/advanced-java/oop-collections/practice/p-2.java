import java.util.Scanner;
import java.util.Map;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) throws Exception {
        Scanner input = new Scanner(System.in);
        int n = input.nextInt();
        Map<String, Integer> counts = new TreeMap<>();
        for (int i = 0; i < n; i++) {
            String word = input.next();
            counts.put(word, counts.getOrDefault(word, 0) + 1);
        }
        if (counts.isEmpty()) { System.out.println("EMPTY"); }
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
    }
}
