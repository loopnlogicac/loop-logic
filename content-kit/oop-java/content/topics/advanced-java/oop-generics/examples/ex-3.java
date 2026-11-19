import java.util.List;
import java.util.ArrayList;

class Main {
    static void copy(List<? extends Integer> source, List<? super Integer> target) {
        for (Integer value : source) { target.add(value); }
    }
    public static void main(String[] args) throws Exception {
        List<Integer> source = List.of(2, 5);
        List<Number> destination = new ArrayList<>();
        copy(source, destination);
        System.out.println(destination);
    }
}
