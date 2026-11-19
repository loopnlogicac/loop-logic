class Main {
    public static void main(String[] args) {
        Integer mark = null;
        int safe = mark == null ? 0 : mark;
        System.out.println(safe);
    }
}
