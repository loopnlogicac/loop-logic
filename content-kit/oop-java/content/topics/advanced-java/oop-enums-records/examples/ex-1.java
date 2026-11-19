enum Status {
    AVAILABLE(0), BORROWED(5);
    private final int dailyFee;
    Status(int dailyFee) { this.dailyFee = dailyFee; }
    int dailyFee() { return dailyFee; }
}

class Main {
    public static void main(String[] args) throws Exception {
        System.out.println(Status.BORROWED.dailyFee());
        System.out.println(Status.AVAILABLE == Status.valueOf("AVAILABLE"));
    }
}
