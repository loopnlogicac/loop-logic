interface Rule { int apply(int value); }

class Main {
    public static void main(String[] args) throws Exception {
        int bonus = 5;
        class LocalRule implements Rule {
            @Override
            public int apply(int value) { return value + bonus; }
        }
        Rule doubled = new Rule() {
            @Override
            public int apply(int value) { return value * 2; }
        };
        System.out.println(new LocalRule().apply(10));
        System.out.println(doubled.apply(10));
    }
}
