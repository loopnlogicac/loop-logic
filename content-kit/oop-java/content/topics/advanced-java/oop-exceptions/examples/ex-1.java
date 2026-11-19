class Main {
    public static void main(String[] args) throws Exception {
        try {
            System.out.println(Integer.parseInt("oops"));
        } catch (NumberFormatException problem) {
            System.out.println("Use digits");
        } finally {
            System.out.println("Done");
        }
    }
}
