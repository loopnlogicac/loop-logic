class Main {
    public static void main(String[] args) {
        StringBuilder first = new StringBuilder("CSE");
        java.lang.StringBuilder second = new java.lang.StringBuilder("CSE");
        System.out.println(first.toString().equals(second.toString()));
    }
}
