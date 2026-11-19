import java.util.List;

class Main {
    public static void main(String[] args) throws Exception {
        System.out.println(List.<Integer>of().stream().reduce(0, Integer::sum));
        System.out.println(List.of(2, 3, 4).stream().reduce(0, Integer::sum));
    }
}
