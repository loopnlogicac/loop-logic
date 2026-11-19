import java.util.Set;
import java.util.HashSet;
import java.util.TreeSet;
import java.util.List;

class Main {
    public static void main(String[] args) throws Exception {
        Set<Integer> rolls = new HashSet<>(List.of(22, 17, 22));
        System.out.println(rolls.size());
        System.out.println(new TreeSet<>(rolls));
    }
}
