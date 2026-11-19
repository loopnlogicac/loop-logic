import java.util.List;

class Main {
    static <T extends Number> double total(List<T> values) {
        double sum = 0;
        for (T value : values) { sum += value.doubleValue(); }
        return sum;
    }
    public static void main(String[] args) throws Exception {
        System.out.println(total(List.of(3, 4)));
        System.out.println(total(List.of(2.5, 1.5)));
    }
}
