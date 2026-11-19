import java.util.List;
import java.util.ArrayList;



class Main {
    public static void main(String[] args) throws Exception {
        List<Integer> marks = new ArrayList<>(List.of(60, 70, 60));
        marks.remove(1);
        marks.add(80);
        System.out.println(marks);
        marks.remove(Integer.valueOf(60));
        System.out.println(marks);
    }
}
