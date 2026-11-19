import java.util.Comparator;



class Main {
    public static void main(String[] args) throws Exception {
        Comparator<Integer> safe = (left, right) -> Integer.compare(left, right);
        System.out.println(safe.compare(Integer.MIN_VALUE, 1) < 0);
        System.out.println(safe.compare(5, 5));
    }
}
