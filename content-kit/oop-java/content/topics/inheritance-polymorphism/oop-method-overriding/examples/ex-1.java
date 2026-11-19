class Fee {
    int amount() { return 500; }
}
class LabFee extends Fee {
    @Override
    int amount() { return 750; }
}

class Main {
    public static void main(String[] args) {
        Fee fee = new LabFee();
        System.out.println(fee.amount());
    }
}
