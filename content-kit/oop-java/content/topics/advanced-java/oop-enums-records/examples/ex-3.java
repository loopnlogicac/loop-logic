record Mark(int roll, int score) {
    Mark {
        if (roll <= 0 || score < 0 || score > 100) {
            throw new IllegalArgumentException("Invalid mark");
        }
    }
}

class Main {
    public static void main(String[] args) throws Exception {
        Mark first = new Mark(7, 80);
        Mark second = new Mark(7, 80);
        System.out.println(first.roll() + " " + first.score());
        System.out.println(first.equals(second));
    }
}
