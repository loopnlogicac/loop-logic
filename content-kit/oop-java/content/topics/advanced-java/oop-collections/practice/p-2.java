import java.util.Scanner;
import java.util.Map;
import java.util.TreeMap;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            int n = input.nextInt();
            Map<String, Integer> counts = new TreeMap<>();
            for (int i = 0; i < n; i++) { counts.merge(input.next(), 1, Integer::sum); }
            for (Map.Entry<String, Integer> entry : counts.entrySet()) {
                System.out.println(entry.getKey() + " " + entry.getValue());
            }
        }
    }
}
