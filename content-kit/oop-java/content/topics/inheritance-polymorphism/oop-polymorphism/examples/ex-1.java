class Fee { int amount() { return 100; } }
class LabFee extends Fee {
    @Override
    int amount() { return 150; }
}

class Main {
    public static void main(String[] args) {
        Fee[] fees = {new Fee(), new LabFee()};
        for (Fee fee : fees) {
            System.out.println(fee.amount());
        }
    }
}
