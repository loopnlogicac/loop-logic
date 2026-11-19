import java.util.List;



class Main {
    public static void main(String[] args) throws Exception {
        List<String> names = List.of("lab", "exam");
        List<String> upper = names.stream().map(String::toUpperCase).toList();
        upper.forEach(System.out::println);
        System.out.println(names);
    }
}
