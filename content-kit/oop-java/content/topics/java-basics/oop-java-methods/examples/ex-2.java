class Main {
    static void raise(int value) {
        value += 5;
    }
    public static void main(String[] args) {
        int mark = 60;
        raise(mark);
        System.out.println(mark);
    }
}
