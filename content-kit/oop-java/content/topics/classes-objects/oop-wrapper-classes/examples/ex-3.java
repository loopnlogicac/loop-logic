class Main {
    public static void main(String[] args) {
        Integer first = Integer.valueOf("1000");
        Integer second = Integer.valueOf("1000");
        System.out.println(first.equals(second));
        System.out.println(Integer.compare(first, second));
    }
}
