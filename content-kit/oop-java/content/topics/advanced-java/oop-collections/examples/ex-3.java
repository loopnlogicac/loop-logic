import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;



class Main {
    public static void main(String[] args) throws Exception {
        Map<String, Integer> counts = new HashMap<>();
        for (String course : new String[] {"CSE", "MAT", "CSE"}) {
            counts.merge(course, 1, Integer::sum);
        }
        for (Map.Entry<String, Integer> entry : new TreeMap<>(counts).entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
    }
}
