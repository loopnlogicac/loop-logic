record Point(int x) {}

class Main {
    public static void main(String[] args) throws Exception {
        Point a = new Point(2);
        Point b = new Point(2);
        System.out.println(a.equals(b));
        System.out.println(a == b);
    }
}
