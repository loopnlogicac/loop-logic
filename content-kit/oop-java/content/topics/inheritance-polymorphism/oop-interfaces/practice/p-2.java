import java.util.Scanner;
interface PricePolicy { int apply(int price); }
class FullPrice implements PricePolicy {
    @Override
    public int apply(int price) { return price; }
}
class HalfPrice implements PricePolicy {
    @Override
    public int apply(int price) { return price / 2; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int kind = input.nextInt();
            int price = input.nextInt();
            PricePolicy policy = kind == 0 ? new FullPrice() : new HalfPrice();
            System.out.println(policy.apply(price));
        }
    }
}
