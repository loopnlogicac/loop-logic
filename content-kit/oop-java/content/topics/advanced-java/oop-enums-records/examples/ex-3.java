record Result(int roll, int mark) {
    Result {
        if (mark < 0 || mark > 100) { throw new IllegalArgumentException("mark"); }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Result first = new Result(7, 80);
        Result second = new Result(7, 80);
        System.out.println(first.equals(second));
        System.out.println(first.roll() + " " + first.mark());
    }
}
