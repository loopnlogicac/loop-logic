enum LoanKind {
    REGULAR(2), SHORT(5);
    private final int dailyRate;
    LoanKind(int dailyRate) { this.dailyRate = dailyRate; }
    int fee(int days) { return dailyRate * days; }
}

class Main {
    public static void main(String[] args) throws Exception {
        for (LoanKind kind : LoanKind.values()) {
            System.out.println(kind.name() + " " + kind.fee(3));
        }
    }
}
