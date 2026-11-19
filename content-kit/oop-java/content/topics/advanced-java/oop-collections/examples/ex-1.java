import java.util.List;
import java.util.ArrayList;
import java.util.LinkedList;

class Main {
    public static void main(String[] args) throws Exception {
        List<Integer> marks = new ArrayList<>(List.of(70, 80, 70));
        marks.remove(Integer.valueOf(70));
        System.out.println(marks);
        LinkedList<String> queue = new LinkedList<>();
        queue.addLast("A");
        queue.addLast("B");
        System.out.println(queue.removeFirst());
    }
}
