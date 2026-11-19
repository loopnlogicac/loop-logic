import java.util.Set;
import java.util.HashSet;
import java.util.TreeSet;



class Main {
    public static void main(String[] args) throws Exception {
        Set<String> rooms = new HashSet<>();
        rooms.add("Lab");
        rooms.add("Hall");
        System.out.println(rooms.add("Lab"));
        System.out.println(new TreeSet<>(rooms));
    }
}
