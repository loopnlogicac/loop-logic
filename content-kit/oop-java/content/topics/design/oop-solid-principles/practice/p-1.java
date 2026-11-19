import java.util.Scanner;
interface Discount { int apply(int price); }
class NoDiscount implements Discount {
    @Override
    public int apply(int price) { return price; }
}
class HalfDiscount implements Discount {
    @Override
    public int apply(int price) { return price / 2; }
}
class TenDiscount implements Discount {
    @Override
    public int apply(int price) { return Math.max(0, price - 10); }
}
class Checkout {
    private final Discount discount;
    Checkout(Discount discount) { this.discount = discount; }
    int total(int price) { return discount.apply(price); }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int kind = input.nextInt();
            int price = input.nextInt();
            Discount[] policies = {new NoDiscount(), new HalfDiscount(), new TenDiscount()};
            Checkout checkout = new Checkout(policies[kind]);
            System.out.println(checkout.total(price));
        }
    }
}
