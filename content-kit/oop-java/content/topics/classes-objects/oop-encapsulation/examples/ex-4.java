class Main {
    public static void main(String[] args) {
        int[] source = {70};
        Marks marks = new Marks(source);
        source[0] = 0;
        int[] copy = marks.values();
        copy[0] = 1;
        System.out.println(marks.values()[0]);
    }
}
final class Marks {
    private final int[] values;
    Marks(int[] values) {
        this.values = values.clone();
    }
    public int[] values() {
        return values.clone();
    }
}
