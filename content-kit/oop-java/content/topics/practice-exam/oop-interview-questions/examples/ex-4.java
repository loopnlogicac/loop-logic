class Main {
    static String label(Number value) { return "Number"; }
    static String label(Integer value) { return "Integer"; }
    public static void main(String[] args) throws Exception {
        Number value = Integer.valueOf(7);
        System.out.println(label(value));
    }
}
