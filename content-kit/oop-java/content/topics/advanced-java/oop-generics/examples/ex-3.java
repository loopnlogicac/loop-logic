import java.util.List;
import java.util.ArrayList;



class Main {
    static <T> void copy(List<? extends T> source, List<? super T> target) {
        for (T value : source) { target.add(value); }
    }
    public static void main(String[] args) throws Exception {
        List<Integer> source = List.of(4, 7);
        List<Number> target = new ArrayList<>();
        copy(source, target);
        System.out.println(target);
    }
}
