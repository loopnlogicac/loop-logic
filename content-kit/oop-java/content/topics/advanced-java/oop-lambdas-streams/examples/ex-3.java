import java.util.List;



class Main {
    public static void main(String[] args) throws Exception {
        System.out.println(List.<Integer>of().stream().reduce(0, Integer::sum));
        System.out.println(List.of(3, 5, 7).stream().reduce(0, Integer::sum));
    }
}
