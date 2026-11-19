class Main {
    static void revise(int[] values) {
        values[0] = 70;
        values = new int[] {90};
    }
    public static void main(String[] args) {
        int[] marks = {60};
        revise(marks);
        System.out.println(marks[0]);
    }
}
