import java.util.List;

class Main {
    public static void main(String[] args) throws Exception {
        List<Integer> marks = List.of(35, 40, 70);
        int sum = marks.stream().filter(mark -> mark >= 40)
                .mapToInt(mark -> mark + 5).sum();
        System.out.println(sum);
        System.out.println(marks);
    }
}
