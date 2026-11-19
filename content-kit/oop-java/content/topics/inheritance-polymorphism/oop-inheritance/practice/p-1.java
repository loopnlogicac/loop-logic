import java.util.Scanner;
class Award {
    private final int base;
    Award(int base) { this.base = base; }
    int total() { return base; }
}
class ScholarAward extends Award {
    private final int extra;
    ScholarAward(int base, int extra) {
        super(base);
        this.extra = extra;
    }
    @Override
    int total() { return super.total() + extra; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int roll = input.nextInt();
            int base = input.nextInt();
            int extra = input.nextInt();
            ScholarAward award = new ScholarAward(base, extra);
            System.out.println(roll);
            System.out.println(award.total());
        }
    }
}
