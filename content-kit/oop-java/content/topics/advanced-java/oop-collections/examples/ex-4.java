import java.util.Deque;
import java.util.LinkedList;



class Main {
    public static void main(String[] args) throws Exception {
        Deque<String> line = new LinkedList<>();
        line.addLast("A");
        line.addLast("B");
        line.addFirst("Urgent");
        while (!line.isEmpty()) { System.out.println(line.removeFirst()); }
    }
}
