import java.util.List;
import java.util.stream.Collectors;



class Main {
    public static void main(String[] args) throws Exception {
        List<Integer> adjusted = List.of(35, 40, 75).stream()
            .filter(mark -> mark >= 40)
            .map(mark -> mark + 2)
            .collect(Collectors.toList());
        System.out.println(adjusted);
    }
}
