class Main {
    public static void main(String[] args) throws Exception {
        try {
            int mark = Integer.parseInt("absent");
            System.out.println(mark);
        } catch (NumberFormatException failure) {
            System.out.println("Enter a whole number");
        } finally {
            System.out.println("Attempt finished");
        }
        System.out.println("Next student");
    }
}
