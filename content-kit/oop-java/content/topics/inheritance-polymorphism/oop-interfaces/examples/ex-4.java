@FunctionalInterface
interface FeePolicy { int apply(int amount); }
class HalfFee implements FeePolicy {
    @Override
    public int apply(int amount) { return amount / 2; }
}

class Main {
    public static void main(String[] args) {
        FeePolicy policy = new HalfFee();
        System.out.println(policy.apply(90));
    }
}
