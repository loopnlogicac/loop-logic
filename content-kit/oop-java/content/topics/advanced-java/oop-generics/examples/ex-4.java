class Main {
    static <T extends Comparable<? super T>> T larger(T left, T right) {
        return left.compareTo(right) >= 0 ? left : right;
    }
    public static void main(String[] args) throws Exception {
        System.out.println(larger("Lab", "Exam"));
        System.out.println(larger(12, 7));
    }
}
