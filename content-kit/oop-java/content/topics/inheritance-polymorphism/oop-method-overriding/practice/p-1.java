import java.util.Scanner;
class HostelFee {
    private final int base;
    HostelFee(int base) { this.base = base; }
    int total() { return base; }
}
class MealPlanFee extends HostelFee {
    private final int meal;
    MealPlanFee(int base, int meal) {
        super(base);
        this.meal = meal;
    }
    @Override
    int total() { return super.total() + meal; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            HostelFee fee = new MealPlanFee(input.nextInt(), input.nextInt());
            System.out.println(fee.total());
        }
    }
}
